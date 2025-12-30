import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { pipeline } from "@xenova/transformers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import os from "os";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION;

if (!QDRANT_URL) {
  throw new Error("QDRANT_URL is not set in .env");
}

let embedder = null;

// ---- Embedding helper (same as in index.js) ----
async function embedText(text) {
  if (!text || !text.trim()) {
    return new Array(384).fill(0); // return zero-vector for safety
  }
  if (!embedder) {
    console.log("⏳ Loading Xenova MiniLM model (once)...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Embedding model loaded!");
  }
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

// ---- BullMQ Worker ----
const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    console.log("JOB DATA:", job.data);

    const { filePath } = job.data;

    console.log("📄 Reading local PDF:", filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error("PDF file not found at path");
    }

    const loader = new PDFLoader(filePath, { splitPages: true });
    const rawDocs = await loader.load();

    // processing ke baad delete
    fs.unlinkSync(filePath);
    console.log("🗑️ Local PDF deleted after processing");

    const splitter = new CharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    let docs = await splitter.splitDocuments(rawDocs);
    docs = docs.filter((d) => d.pageContent?.trim());

    const client = new QdrantClient({ url: QDRANT_URL });

    await client.recreateCollection(QDRANT_COLLECTION, {
      vectors: { size: 384, distance: "Cosine" },
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      {
        embedDocuments: async (docs) =>
          Promise.all(docs.map((d) => embedText(d.pageContent))),
        embedQuery: embedText,
      },
      {
        url: QDRANT_URL,
        collectionName: QDRANT_COLLECTION,
      }
    );

    await vectorStore.addDocuments(docs);

    console.log("✅ PDF indexed successfully");
  },
  {
    concurrency: 1,
    connection: { url: process.env.REDIS_URL },
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});
