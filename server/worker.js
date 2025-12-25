import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { pipeline } from "@xenova/transformers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import fs from "fs";
import os from "os";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

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
    console.log("📄 New job received:", job.data);

    const data = job.data;
    console.log("🔗 Cloudinary URL:", data.pdfUrl);

    // 1) Load PDF
    if (!data.pdfUrl) {
      throw new Error("pdfUrl missing in job data");
    }

    // ---- Download PDF from Cloudinary ----
    const response = await fetch(data.pdfUrl);

    if (!response.ok) {
      throw new Error("Failed to download PDF from Cloudinary");
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // ---- Save to temp file ----
    const tempPdfPath = path.join(os.tmpdir(), `pdf-${Date.now()}.pdf`);

    fs.writeFileSync(tempPdfPath, buffer);

    async function downloadPdf(url) {
      const tempPath = path.join(os.tmpdir(), `pdf-${Date.now()}.pdf`);

      const response = await axios({
        method: "GET",
        url,
        responseType: "arraybuffer",
        timeout: 30000,
        maxRedirects: 5,
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "*/*",
        },
        validateStatus: (status) => status >= 200 && status < 400,
      });

      if (!response.data || response.data.byteLength === 0) {
        throw new Error("Downloaded PDF is empty");
      }

      fs.writeFileSync(tempPath, response.data);

      console.log("📥 PDF downloaded to:", tempPath);
      return tempPath;
    }

    // ⬇ Download PDF from Cloudinary
    const localPdfPath = await downloadPdf(data.pdfUrl);

    // 📄 Load PDF
    const loader = new PDFLoader(localPdfPath, { splitPages: true });
    const rawDocs = await loader.load();

    // 🧹 Cleanup temp file
    fs.unlinkSync(localPdfPath);

    console.log("Raw docs:", rawDocs.length);

    // 2) Split into chunks
    const splitter = new CharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    let docs = await splitter.splitDocuments(rawDocs);
    console.log("Chunks created (before filter):", docs.length);

    // Remove empty or null content chunks
    docs = docs.filter((d) => d.pageContent && d.pageContent.trim().length > 0);

    console.log("Chunks after filtering empty ones:", docs.length);

    // 3) Ensure collection in Qdrant
    const client = new QdrantClient({ url: QDRANT_URL });

    // NOTE: recreateCollection = har upload par purani vectors delete.
    // Agar tum multiple PDFs store karna chahte ho, yahan createCollection + try/catch karo.
    await client.recreateCollection(QDRANT_COLLECTION, {
      vectors: {
        size: 384, // MiniLM output dim
        distance: "Cosine",
      },
    });
    console.log("📦 Qdrant collection ready!");

    // 4) VectorStore wrapper with SAME embeddings
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      {
        embedDocuments: async (docs) =>
          Promise.all(docs.map((d) => embedText(d.pageContent))),
        embedQuery: async (query) => embedText(query),
      },
      {
        url: QDRANT_URL,
        collectionName: QDRANT_COLLECTION,
      }
    );

    console.log("⬆ Uploading chunks to Qdrant...");
    await vectorStore.addDocuments(docs);
    console.log("🔥 SUCCESS! All PDF chunks inserted into Qdrant!");
  },
  {
    concurrency: 1,
    connection: {
      url: process.env.REDIS_URL,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});
