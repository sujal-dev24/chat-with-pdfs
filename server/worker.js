// import { Worker } from "bullmq";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import { Document } from "@langchain/core/documents";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { CharacterTextSplitter } from "@langchain/textsplitters";

// const worker = new Worker(
//   "file-upload-queue",
//   async (job) => {
//     console.log("job", job.data);
//     const data = JSON.parse(job.data);
//     const loader = new PDFLoader(data.path);
//     // const docs = await loader.load();

//     const rawDocs = await loader.load();

//     const splitter = new CharacterTextSplitter({
//       chunkSize: 1000,
//       chunkOverlap: 200,
//     });

//     const docs = await splitter.splitDocuments(rawDocs);
//     console.log("docs: ", docs);

//     const embeddings = new OpenAIEmbeddings({
//       model: "gpt-4o-mini",
//       apiKey: process.env.OPENAI_API_KEY,
//     });

//     const vectorStore = await QdrantVectorStore.fromExistingCollection(
//       embeddings,
//       {
//         url: process.env.QDRANT_URL,
//         collectionName: process.env.QDRANT_COLLECTION,
//       }
//     );
//     await vectorStore.addDocuments(docs);
//     console.log("All docs are added to vector store");
//   },
//   {
//     concurrency: 100,
//     connection: {
//       host: process.env.REDIS_HOST,
//       port: process.env.REDIS_PORT,
//     },
//   }
// );

// import { Worker } from "bullmq";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { CharacterTextSplitter } from "@langchain/textsplitters";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// dotenv.config({
//   path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env"),
// });

// const worker = new Worker(
//   "file-upload-queue",
//   async (job) => {
//     console.log("job:", job.data);

//     const data = JSON.parse(job.data);

//     // Load PDF
//     const loader = new PDFLoader(data.path);
//     const rawDocs = await loader.load();
//     console.log("Raw docs:", rawDocs.length);

//     // Split PDFs correctly
//     const splitter = new CharacterTextSplitter({
//       chunkSize: 500,
//       chunkOverlap: 50,
//     });

//     const docs = await splitter.splitDocuments(rawDocs);
//     console.log("Chunks created:", docs.length);

//     // Embeddings
//     const embeddings = new OpenAIEmbeddings({
//       model: "text-embedding-3-small",
//       apiKey: process.env.OPENAI_API_KEY,
//     });

//     // Ensure collection exists
//     await QdrantVectorStore.fromTexts(["init"], [{ id: 1 }], embeddings, {
//       url: process.env.QDRANT_URL,
//       collectionName: process.env.QDRANT_COLLECTION,
//     });

//     // Connect to Qdrant
//     const vectorStore = await QdrantVectorStore.fromExistingCollection(
//       embeddings,
//       {
//         url: process.env.QDRANT_URL,
//         collectionName: process.env.QDRANT_COLLECTION,
//       }
//     );

//     // Store chunks
//     await vectorStore.addDocuments(docs);

//     console.log("All chunks added to Qdrant successfully.");
//   },
//   {
//     concurrency: 50,
//     connection: {
//       host: "localhost",
//       port: "6379",
//     },
//   }
// );

// import { Worker } from "bullmq";
// import { GroqEmbeddings } from "@langchain/groq";
// import { QdrantVectorStore } from "@langchain/qdrant";
// // import { PDFLoader } from "langchain/document_loaders/fs/pdf";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { CharacterTextSplitter } from "@langchain/textsplitters";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// const worker = new Worker(
//   "file-upload-queue",
//   async (job) => {
//     console.log("job:", job.data);

//     const data = JSON.parse(job.data);

//     // FIXED PDF LOADER
//     const loader = new PDFLoader(data.path, {
//       splitPages: true,
//     });

//     const rawDocs = await loader.load();
//     console.log("Raw docs:", rawDocs.length);

//     const splitter = new CharacterTextSplitter({
//       chunkSize: 500,
//       chunkOverlap: 50,
//     });

//     const docs = await splitter.splitDocuments(rawDocs);
//     console.log("Chunks created:", docs.length);

//     const embeddings = new GroqEmbeddings({
//       apiKey: process.env.GROQ_API_KEY,
//       model: "text-embedding-3-small",
//     });

//     // Ensure collection exists
//     await QdrantVectorStore.fromTexts(["init chunk"], [{ id: 1 }], embeddings, {
//       url: process.env.QDRANT_URL,
//       collectionName: process.env.QDRANT_COLLECTION,
//     });

//     const vectorStore = await QdrantVectorStore.fromExistingCollection(
//       embeddings,
//       {
//         url: process.env.QDRANT_URL,
//         collectionName: process.env.QDRANT_COLLECTION,
//       }
//     );

//     await vectorStore.addDocuments(docs);

//     console.log("🔥 All chunks added to Qdrant successfully!");
//   },
//   {
//     concurrency: 50,
//     connection: {
//       host: "localhost",
//       port: "6379",
//     },
//   }
// );

// import { Worker } from "bullmq";
// import { TransformersEmbeddings } from "@langchain/community/embeddings/transformers";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { CharacterTextSplitter } from "@langchain/textsplitters";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// const worker = new Worker(
//   "file-upload-queue",
//   async (job) => {
//     console.log("job:", job.data);

//     const data = JSON.parse(job.data);

//     // Load PDF (page-wise)
//     const loader = new PDFLoader(data.path, { splitPages: true });
//     const rawDocs = await loader.load();
//     console.log("Raw docs:", rawDocs.length);

//     // Split into chunks
//     const splitter = new CharacterTextSplitter({
//       chunkSize: 500,
//       chunkOverlap: 50,
//     });

//     const docs = await splitter.splitDocuments(rawDocs);
//     console.log("Chunks created:", docs.length);

//     // Free embeddings
//    const embeddings = new TransformersEmbeddings({
//       modelName: "Xenova/all-MiniLM-L6-v2",
//     });

//     await QdrantVectorStore.fromTexts(
//       ["init chunk"],
//       [
//         {
//           type: "init",
//           note: "Collection created successfully",
//         },
//       ],
//       embeddings,
//       {
//         url: process.env.QDRANT_URL,
//         collectionName: process.env.QDRANT_COLLECTION,
//       }
//     );

//     // Connect to Qdrant collection
//     const vectorStore = await QdrantVectorStore.fromExistingCollection(
//       embeddings,
//       {
//         url: process.env.QDRANT_URL,
//         collectionName: process.env.QDRANT_COLLECTION,
//       }
//     );

//     // Store all chunks
//     await vectorStore.addDocuments(docs);

//     console.log("🔥 All chunks added to Qdrant successfully!");
//   },
//   {
//     concurrency: 50,
//     connection: {
//       host: "localhost",
//       port: "6379",
//     },
//   }
// );

// import { Worker } from "bullmq";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { CharacterTextSplitter } from "@langchain/textsplitters";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// // Xenova transformers (direct offline embeddings)
// import { pipeline } from "@xenova/transformers";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// const worker = new Worker(
//   "file-upload-queue",
//   async (job) => {
//     console.log("job:", job.data);
//     const data = JSON.parse(job.data);

//     const loader = new PDFLoader(data.path, { splitPages: true });
//     const rawDocs = await loader.load();
//     console.log("Raw docs:", rawDocs.length);

//     const splitter = new CharacterTextSplitter({
//       chunkSize: 500,
//       chunkOverlap: 50,
//     });

//     const docs = await splitter.splitDocuments(rawDocs);
//     console.log("Chunks created:", docs.length);

//     // ------------------------------
//     // 🚀 OFFLINE EMBEDDINGS (NO API)
//     // ------------------------------
//     const embedder = await pipeline(
//       "feature-extraction",
//       "Xenova/all-MiniLM-L6-v2"
//     );

//     async function embedText(text) {
//       const output = await embedder(text, { pooling: "mean", normalize: true });
//       return Array.from(output.data);
//     }

//     // Create collection if not exists
//     await QdrantVectorStore.fromTexts(
//       ["init"],
//       [{}],
//       {
//         embedDocuments: async (arr) => [await embedText(arr[0])],
//         embedQuery: async (text) => await embedText(text),
//       },
//       {
//         url: process.env.QDRANT_URL,
//         collectionName: process.env.QDRANT_COLLECTION,
//       }
//     );

//     // Connect to existing Qdrant collection
//     const vectorStore = await QdrantVectorStore.fromExistingCollection(
//       {
//         embedDocuments: async (arr) =>
//           Promise.all(arr.map((t) => embedText(t.pageContent))),
//         embedQuery: async (text) => await embedText(text),
//       },
//       {
//         url: process.env.QDRANT_URL,
//         collectionName: process.env.QDRANT_COLLECTION,
//       }
//     );

//     await vectorStore.addDocuments(docs);

//     console.log("🔥 All chunks added to Qdrant successfully!");
//   },
//   {
//     concurrency: 50,
//     connection: {
//       host: "localhost",
//       port: "6379",
//     },
//   }
// );

// import { Worker } from "bullmq";
// import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { CharacterTextSplitter } from "@langchain/textsplitters";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// const worker = new Worker(
//   "file-upload-queue",
//   async (job) => {
//     console.log("job:", job.data);

//     const data = JSON.parse(job.data);

//     // Load PDF (page-wise)
//     const loader = new PDFLoader(data.path, { splitPages: true });
//     const rawDocs = await loader.load();
//     console.log("Raw docs:", rawDocs.length);

//     // Split into chunks
//     const splitter = new CharacterTextSplitter({
//       chunkSize: 500,
//       chunkOverlap: 50,
//     });

//     const docs = await splitter.splitDocuments(rawDocs);
//     console.log("Chunks created:", docs.length);

//     // ⭐ HuggingFace FREE API embeddings (No model download)
//     const embeddings = new HuggingFaceInferenceEmbeddings({
//       apiKey: process.env.HF_API_KEY,
//       model: "sentence-transformers/all-MiniLM-L6-v2",
//     });

//     // Make sure collection exists
//     await QdrantVectorStore.fromTexts(
//       ["init"],
//       [{}],
//       embeddings,
//       {
//         url: process.env.QDRANT_URL,
//         collectionName: process.env.QDRANT_COLLECTION,
//       }
//     );

//     // Connect to Qdrant
//     const vectorStore = await QdrantVectorStore.fromExistingCollection(
//       embeddings,
//       {
//         url: process.env.QDRANT_URL,
//         collectionName: process.env.QDRANT_COLLECTION,
//       }
//     );

//     // ⭐ Store chunks in Qdrant
//     await vectorStore.addDocuments(docs);

//     console.log("🔥 All chunks added to Qdrant successfully!");
//   },
//   {
//     concurrency: 20,
//     connection: {
//       host: "localhost",
//       port: "6379",
//     },
//   }
// );

// import { Worker } from "bullmq";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { CharacterTextSplitter } from "@langchain/textsplitters";

// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// import { pipeline } from "@xenova/transformers"; // ⬅ MUST USE THIS!!

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// // -----------------------------
// // 🧠 OFFLINE EMBEDDING MODEL
// // -----------------------------
// let embedder = null;

// async function embedText(text) {
//   if (!embedder) {
//     console.log("Loading Xenova MiniLM model (first time only)...");
//     embedder = await pipeline(
//       "feature-extraction",
//       "Xenova/all-MiniLM-L6-v2"
//     );
//     console.log("Model Loaded!");
//   }

//   const output = await embedder(text, { pooling: "mean", normalize: true });
//   return Array.from(output.data);
// }

// // -----------------------------
// // WORKER
// // -----------------------------
// const worker = new Worker(
//   "file-upload-queue",
//   async (job) => {
//     console.log("job:", job.data);

//     const data = JSON.parse(job.data);

//     // Load PDF
//     const loader = new PDFLoader(data.path, { splitPages: true });
//     const rawDocs = await loader.load();
//     console.log("Raw docs:", rawDocs.length);

//     // Split into chunks
//     const splitter = new CharacterTextSplitter({
//       chunkSize: 500,
//       chunkOverlap: 50,
//     });

//     const docs = await splitter.splitDocuments(rawDocs);
//     console.log("Chunks created:", docs.length);

//     // VECTOR STORE — using custom embeddings
//     const vectorStore = await QdrantVectorStore.fromExistingCollection(
//       {
//         embedDocuments: async (docs) =>
//           Promise.all(docs.map((d) => embedText(d.pageContent))),
//         embedQuery: async (query) => embedText(query),
//       },
//       {
//         url: process.env.QDRANT_URL,
//         collectionName: process.env.QDRANT_COLLECTION,
//       }
//     );

//     // Store chunks in Qdrant
//     await vectorStore.addDocuments(docs);

//     console.log("🔥 All chunks added to Qdrant successfully!");
//   },
//   {
//     concurrency: 50,
//     connection: {
//       host: "localhost",
//       port: "6379",
//     },
//   }
// );

// import { Worker } from "bullmq";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { CharacterTextSplitter } from "@langchain/textsplitters";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import { pipeline } from "@xenova/transformers";

// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// let embedder = null;

// async function embedText(text) {
//   if (!embedder) {
//     console.log("Loading Xenova MiniLM model...");
//     embedder = await pipeline(
//       "feature-extraction",
//       "Xenova/all-MiniLM-L6-v2"
//     );
//     console.log("Model Loaded!");
//   }

//   const output = await embedder(text, { pooling: "mean", normalize: true });
//   return Array.from(output.data);
// }

// const worker = new Worker(
//   "file-upload-queue",
//   async (job) => {
//     console.log("job:", job.data);

//     const data = JSON.parse(job.data);

//     const loader = new PDFLoader(data.path, { splitPages: true });
//     const rawDocs = await loader.load();
//     console.log("Raw docs:", rawDocs.length);

//     const splitter = new CharacterTextSplitter({
//       chunkSize: 500,
//       chunkOverlap: 50,
//     });

//     const docs = await splitter.splitDocuments(rawDocs);
//     console.log("Chunks created:", docs.length);

//     // Initialize Qdrant Vector Store
//     const vectorStore = await QdrantVectorStore.fromExistingCollection(
//       {
//         embedDocuments: async (docs) =>
//           Promise.all(docs.map((d) => embedText(d.pageContent))),
//         embedQuery: async (q) => embedText(q),
//       },
//       {
//         url: process.env.QDRANT_URL,
//         collectionName: process.env.QDRANT_COLLECTION,
//       }
//     );

//     console.log("Adding documents to Qdrant...");

//     await vectorStore.addDocuments(docs);

//     console.log("🔥 All chunks added to Qdrant successfully!");
//   },
//   {
//     concurrency: 1,
//     connection: {
//       host: "localhost",
//       port: 6379,
//     },
//   }
// );

// import { Worker } from "bullmq";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { CharacterTextSplitter } from "@langchain/textsplitters";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import { QdrantClient } from "@qdrant/js-client-rest";
// import { pipeline } from "@xenova/transformers";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.join(__dirname, ".env") });

// let embedder = null;

// async function embedText(text) {
//   if (!embedder) {
//     console.log("Loading Xenova MiniLM model (once)...");
//     embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
//     console.log("Model Loaded!");
//   }

//   const output = await embedder(text, { pooling: "mean", normalize: true });
//   return Array.from(output.data);
// }

// const worker = new Worker(
//   "file-upload-queue",
//   async (job) => {
//     console.log("job:", job.data);

//     const data = JSON.parse(job.data);

//     const loader = new PDFLoader(data.path, { splitPages: true });
//     const rawDocs = await loader.load();
//     console.log("Raw docs:", rawDocs.length);

//     const splitter = new CharacterTextSplitter({
//       chunkSize: 500,
//       chunkOverlap: 30,
//     });

//     const docs = await splitter.splitDocuments(rawDocs);
//     console.log("Chunks created:", docs.length);

//     // -------------------------
//     // CREATE COLLECTION IF NOT EXISTS
//     // -------------------------
//     const client = new QdrantClient({ url: process.env.QDRANT_URL });

//     await client.recreateCollection(process.env.QDRANT_COLLECTION, {
//       vectors: {
//         size: 384, // Xenova MiniLM output size
//         distance: "Cosine",
//       },
//     });

//     console.log("Qdrant collection ready!");

//     const vectorStore = await QdrantVectorStore.fromExistingCollection(
//       {
//         embedDocuments: async (docs) =>
//           Promise.all(docs.map((d) => embedText(d.pageContent))),
//         embedQuery: async (q) => embedText(q),
//       },
//       {
//         url: process.env.QDRANT_URL,
//         collectionName: process.env.QDRANT_COLLECTION,
//       }
//     );

//     console.log("Adding chunks to Qdrant...");

//     await vectorStore.addDocuments(docs);

//     console.log("🔥 SUCCESS! All PDF chunks inserted into Qdrant!");
//   },
//   {
//     concurrency: 1,
//     connection: {
//       host: "localhost",
//       port: 6379,
//     },
//   }
// );

// import { Worker } from "bullmq";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { CharacterTextSplitter } from "@langchain/textsplitters";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import { QdrantClient } from "@qdrant/js-client-rest";
// import { pipeline } from "@xenova/transformers";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// // ------------------------------
// // Load embeddings once
// // ------------------------------

// let embedder = null;

// async function embedText(text) {
//   if (!embedder) {
//     console.log("⏳ Loading Xenova MiniLM model...");
//     embedder = await pipeline(
//       "feature-extraction",
//       "Xenova/all-MiniLM-L6-v2"
//     );
//     console.log("✅ Model loaded!");
//   }

//   const output = await embedder(text, { pooling: "mean", normalize: true });
//   return Array.from(output.data); // returns vector array
// }

// // ------------------------------
// // Worker
// // ------------------------------

// const worker = new Worker(
//   "file-upload-queue",
//   async (job) => {
//     console.log("job:", job.data);

//     const data = JSON.parse(job.data);

//     // Load PDF pages
//     const loader = new PDFLoader(data.path, { splitPages: true });
//     const rawDocs = await loader.load();
//     console.log("Raw docs:", rawDocs.length);

//     // Split to chunks
//     const splitter = new CharacterTextSplitter({
//       chunkSize: 500,
//       chunkOverlap: 50,
//     });

//     const docs = await splitter.splitDocuments(rawDocs);
//     console.log("Chunks created:", docs.length);

//     // -------------------------
//     // Ensure Qdrant collection
//     // -------------------------

//     const client = new QdrantClient({ url: process.env.QDRANT_URL });

//     await client.recreateCollection(process.env.QDRANT_COLLECTION, {
//       vectors: {
//         size: 384, // embedding size
//         distance: "Cosine",
//       },
//     });

//     console.log("📦 Qdrant collection ready!");

//     // -------------------------
//     // Prepare points for Qdrant
//     // -------------------------

//     const points = [];

//     for (let i = 0; i < docs.length; i++) {
//       const vector = await embedText(docs[i].pageContent);

//       points.push({
//         id: i + 1,
//         vector,
//         payload: {
//           content: docs[i].pageContent,
//           metadata: docs[i].metadata || {},
//         },
//       });
//     }

//     console.log("Uploading vectors → Qdrant...");

//     await client.upsert(process.env.QDRANT_COLLECTION, {
//       wait: true,
//       points,
//     });

//     console.log("🔥 SUCCESS! All PDF chunks inserted into Qdrant!");
//   },
//   {
//     concurrency: 1,
//     connection: {
//       host: "localhost",
//       port: 6379,
//     },
//   }
// );

import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { pipeline } from "@xenova/transformers";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = Number(process.env.REDIS_PORT);
const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_COLLECTION =
  process.env.QDRANT_COLLECTION;

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

    const data = JSON.parse(job.data);

    // 1) Load PDF
    const loader = new PDFLoader(data.path, { splitPages: true });
    const rawDocs = await loader.load();
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
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});
