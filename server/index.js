// import express from "express";
// import cors from "cors";
// import multer from "multer";
// import { Queue } from "bullmq";
// import { GroqEmbeddings } from "@langchain/groq";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import { OpenAI } from "openai";

// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// // Force dotenv to load from correct folder
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// console.log("Loaded Key =>", process.env.GROQ_API_KEY);

// const client = new OpenAI({ apiKey: process.env.GROQ_API_KEY });
// const queue = new Queue("file-upload-queue", {
//   connection: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//   },
// });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });

// const app = express();
// const port = 8000;

// app.use(cors());

// app.get("/", (req, res) => {
//   return res.json({ status: "All Good" });
// });

// app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
//   await queue.add(
//     "file-upload",
//     JSON.stringify({
//       filename: req.file.originalname,
//       destination: req.file.destination,
//       path: req.file.path,
//     })
//   );
//   return res.json({ status: "file uploaded" });
// });

// app.get("/chat", async (req, res) => {
//   const userQuery = req.query.message;

//   const embeddings = new GroqEmbeddings({
//     apiKey: process.env.GROQ_API_KEY,
//     model: "text-embedding-3-small",
//   });

//   const vectorStore = await QdrantVectorStore.fromExistingCollection(
//     embeddings,
//     {
//       url: process.env.QDRANT_URL,
//       collectionName: process.env.QDRANT_COLLECTION,
//     }
//   );

//   const ret = vectorStore.asRetriever({
//     k: 2,
//   });
//   const result = await ret.invoke(userQuery);
//   const SYSTEM_PROMPT = `You are helpful AI Assignment who answers the user query based on the available context from PDF File Context:${JSON.stringify(
//     result
//   )}`;

//   const chatResult = await client.chat.completions.create({
//     model: "text-embedding-3-small",
//     messages: [
//       {
//         role: "system",
//         content: SYSTEM_PROMPT,
//       },
//       {
//         role: "user",
//         content: userQuery,
//       },
//     ],
//   });

//   return res.json({
//     messages: chatResult.choices[0].message.content,
//     doc: result,
//   });
// });

// app.listen(port, () => {
//   console.log(`server is started on PORT: ${port}`);
// });

// import express from "express";
// import cors from "cors";
// import multer from "multer";
// import { Queue } from "bullmq";
// import { TransformersEmbeddings } from "@langchain/community/embeddings/transformers";
// import { QdrantVectorStore } from "@langchain/qdrant";

// import Groq from "groq-sdk"; // for chat

// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// console.log("Loaded GROQ Key =>", process.env.GROQ_API_KEY);

// // Chat client (Groq)
// const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // Redis queue
// const queue = new Queue("file-upload-queue", {
//   connection: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//   },
// });

// // multer config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });

// const app = express();
// const port = 8000;

// app.use(cors());

// app.get("/", (req, res) => {
//   return res.json({ status: "All Good" });
// });

// // Upload PDF → Send to worker
// app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
//   await queue.add(
//     "file-upload",
//     JSON.stringify({
//       filename: req.file.originalname,
//       destination: req.file.destination,
//       path: req.file.path,
//     })
//   );
//   return res.json({ status: "file uploaded" });
// });

// // CHAT route
// app.get("/chat", async (req, res) => {
//   const userQuery = req.query.message;

//   // FREE embeddings (MiniLM)
//   const embeddings = new TransformersEmbeddings({
//     modelName: "Xenova/all-MiniLM-L6-v2",
//   });

//   const vectorStore = await QdrantVectorStore.fromExistingCollection(
//     embeddings,
//     {
//       url: process.env.QDRANT_URL,
//       collectionName: process.env.QDRANT_COLLECTION,
//     }
//   );

//   const ret = vectorStore.asRetriever({
//     k: 3,
//   });

//   const result = await ret.invoke(userQuery);

//   const SYSTEM_PROMPT = `You are a helpful PDF assistant. Use ONLY the following context to answer:\n\n${JSON.stringify(
//     result
//   )}`;

//   // FREE Groq Chat Model
//   const chatResult = await client.chat.completions.create({
//     model: "llama3-70b-8192",
//     messages: [
//       {
//         role: "system",
//         content: SYSTEM_PROMPT,
//       },
//       {
//         role: "user",
//         content: userQuery,
//       },
//     ],
//   });

//   return res.json({
//     messages: chatResult.choices[0].message.content,
//     doc: result,
//   });
// });

// app.listen(port, () => {
//   console.log(`server is started on PORT: ${port}`);
// });

// import express from "express";
// import cors from "cors";
// import multer from "multer";
// import { Queue } from "bullmq";

// import { QdrantVectorStore } from "@langchain/qdrant";
// import Groq from "groq-sdk";

// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import { pipeline } from "@xenova/transformers";  // ⬅ SAME AS worker.js

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// // Groq Client for Chat
// const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // Redis Queue
// const queue = new Queue("file-upload-queue", {
//   connection: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//   },
// });

// // Multer Config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage: storage });

// const app = express();
// app.use(cors());
// const port = 8000;

// // ---------------------------
// // 🚀 OFFLINE EMBEDDINGS (Same as worker.js)
// // ---------------------------
// let embedder = null;

// async function embedText(text) {
//   if (!embedder) {
//     embedder = await pipeline(
//       "feature-extraction",
//       "Xenova/all-MiniLM-L6-v2"
//     );
//   }

//   const output = await embedder(text, { pooling: "mean", normalize: true });
//   return Array.from(output.data);
// }

// // ---------------------------
// // ROUTES
// // ---------------------------

// app.get("/", (req, res) => {
//   res.json({ status: "All Good" });
// });

// // Upload PDF → Worker processes it
// app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
//   await queue.add(
//     "file-upload",
//     JSON.stringify({
//       filename: req.file.originalname,
//       destination: req.file.destination,
//       path: req.file.path,
//     })
//   );

//   res.json({ status: "file uploaded" });
// });

// // CHAT route
// app.get("/chat", async (req, res) => {
//   const userQuery = req.query.message;

//   // Qdrant with SAME embedding logic as worker
//   const vectorStore = await QdrantVectorStore.fromExistingCollection(
//     {
//       embedDocuments: async (docs) =>
//         Promise.all(docs.map((d) => embedText(d.pageContent))),
//       embedQuery: async (query) => embedText(query),
//     },
//     {
//       url: process.env.QDRANT_URL,
//       collectionName: process.env.QDRANT_COLLECTION,
//     }
//   );

//   const ret = vectorStore.asRetriever({ k: 3 });
//   const result = await ret.invoke(userQuery);

//   const SYSTEM_PROMPT = `You are a helpful PDF assistant. Use ONLY the following PDF context:\n\n${JSON.stringify(
//     result
//   )}`;

//   const chatResult = await client.chat.completions.create({
//     model: "llama3-70b-8192",
//     messages: [
//       { role: "system", content: SYSTEM_PROMPT },
//       { role: "user", content: userQuery },
//     ],
//   });

//   res.json({
//     messages: chatResult.choices[0].message.content,
//     doc: result,
//   });
// });

// app.listen(port, () => {
//   console.log(`server is started on PORT: ${port}`);
// });

// import express from "express";
// import cors from "cors";
// import multer from "multer";
// import { Queue } from "bullmq";

// import { QdrantVectorStore } from "@langchain/qdrant";
// import Groq from "groq-sdk";

// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// import { pipeline } from "@xenova/transformers"; // SAME EMBEDDINGS AS worker.js

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// // GROQ MODEL
// const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // Redis Queue
// const queue = new Queue("file-upload-queue", {
//   connection: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//   },
// });

// const app = express();
// app.use(cors());
// const port = 8000;

// // -------------------------
// // 🚀 OFFLINE EMBEDDINGS (SAME AS WORKER.JS)
// // -------------------------
// let embedder = null;

// async function embedText(text) {
//   if (!embedder) {
//     console.log("Loading Xenova MiniLM model...");
//     embedder = await pipeline(
//       "feature-extraction",
//       "Xenova/all-MiniLM-L6-v2"
//     );
//     console.log("Model Loaded Successfully!");
//   }

//   const output = await embedder(text, { pooling: "mean", normalize: true });
//   return Array.from(output.data); // returns vector array
// }

// // -------------------------
// // Multer Setup
// // -------------------------
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage: storage });

// // -------------------------
// // ROUTES
// // -------------------------

// app.get("/", (req, res) => {
//   res.json({ status: "All Good" });
// });

// // Upload PDF → worker processes & stores embeddings
// app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
//   await queue.add(
//     "file-upload",
//     JSON.stringify({
//       filename: req.file.originalname,
//       destination: req.file.destination,
//       path: req.file.path,
//     })
//   );

//   res.json({ status: "file uploaded" });
// });

// // CHAT API — searches vectors + generates answer
// app.get("/chat", async (req, res) => {
//   const userQuery = req.query.message;

//   // Qdrant Connection with SAME embedding methods as worker
//   const vectorStore = await QdrantVectorStore.fromExistingCollection(
//     {
//       embedDocuments: async (docs) =>
//         Promise.all(docs.map((d) => embedText(d.pageContent))),
//       embedQuery: async (query) => embedText(query),
//     },
//     {
//       url: process.env.QDRANT_URL,
//       collectionName: process.env.QDRANT_COLLECTION,
//     }
//   );

//   const retriever = vectorStore.asRetriever({ k: 3 });
//   const result = await retriever.invoke(userQuery);

//   const SYSTEM_PROMPT = `You are a helpful assistant. Use ONLY the following PDF context to answer:\n\n${JSON.stringify(
//     result
//   )}`;

//   const chatResult = await client.chat.completions.create({
//     model: "llama3-70b-8192",
//     messages: [
//       { role: "system", content: SYSTEM_PROMPT },
//       { role: "user", content: userQuery },
//     ],
//   });

//   res.json({
//     messages: chatResult.choices[0].message.content,
//     doc: result,
//   });
// });

// // Start Server
// app.listen(port, () => {
//   console.log(`server is started on PORT: ${port}`);
// });

// import express from "express";
// import cors from "cors";
// import multer from "multer";
// import { Queue } from "bullmq";

// import { QdrantVectorStore } from "@langchain/qdrant";
// import Groq from "groq-sdk";

// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// import { pipeline } from "@xenova/transformers"; // SAME OFFLINE EMBEDDINGS AS WORKER.JS

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// // GROQ Client
// const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // Redis Queue
// const queue = new Queue("file-upload-queue", {
//   connection: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//   },
// });

// const app = express();
// app.use(cors());

// const port = 8000;

// // -----------------------------------------------
// // 🚀 LOCAL EMBEDDINGS — SAME LOGIC AS worker.js
// // -----------------------------------------------
// let embedder = null;

// async function embedText(text) {
//   if (!embedder) {
//     console.log("INDEX.JS → Loading Xenova MiniLM model...");
//     embedder = await pipeline(
//       "feature-extraction",
//       "Xenova/all-MiniLM-L6-v2"
//     );
//     console.log("INDEX.JS → Model Loaded Successfully!");
//   }

//   const output = await embedder(text, { pooling: "mean", normalize: true });
//   return Array.from(output.data);
// }

// // -----------------------------------------------
// // File Upload (multer)
// // -----------------------------------------------
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });

// // -----------------------------------------------
// // ROUTES
// // -----------------------------------------------

// app.get("/", (req, res) => {
//   res.json({ status: "Server OK!" });
// });

// // Upload PDF → Worker will process it
// app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
//   await queue.add(
//     "file-upload",
//     JSON.stringify({
//       filename: req.file.originalname,
//       path: req.file.path,
//       destination: req.file.destination,
//     })
//   );

//   res.json({ status: "File uploaded & queued for processing" });
// });

// // CHAT → Search Qdrant + Generate Answer
// app.get("/chat", async (req, res) => {
//   const userQuery = req.query.message;

//   // CONNECT TO EXISTING QDRANT COLLECTION
//   const vectorStore = await QdrantVectorStore.fromExistingCollection(
//     {
//       embedDocuments: async (docs) =>
//         Promise.all(docs.map((d) => embedText(d.pageContent))), // SAME AS WORKER
//       embedQuery: async (query) => embedText(query), // SAME AS WORKER
//     },
//     {
//       url: process.env.QDRANT_URL,
//       collectionName: process.env.QDRANT_COLLECTION,
//     }
//   );

//   // Search relevant chunks
//   const retriever = vectorStore.asRetriever({ k: 3 });
//   const result = await retriever.invoke(userQuery);

//   // Build prompt for Groq
//   const SYSTEM_PROMPT = `You are a helpful PDF chatbot. Answer ONLY from this context:\n\n${JSON.stringify(
//     result
//   )}`;

//   // Ask Groq LLaMA3
//   const chatResult = await client.chat.completions.create({
//     model: "llama3-70b-8192",
//     messages: [
//       { role: "system", content: SYSTEM_PROMPT },
//       { role: "user", content: userQuery },
//     ],
//   });

//   res.json({
//     answer: chatResult.choices[0].message.content,
//     context: result,
//   });
// });

// // Start Server
// app.listen(port, () => {
//   console.log(`server is started on PORT: ${port}`);
// });

// import express from "express";
// import cors from "cors";
// import multer from "multer";
// import { Queue } from "bullmq";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import Groq from "groq-sdk";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import { pipeline } from "@xenova/transformers";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// const queue = new Queue("file-upload-queue", {
//   connection: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//   },
// });

// const app = express();
// const port = 8000;
// app.use(cors());

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

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname),
// });
// const upload = multer({ storage });

// app.get("/", (req, res) => res.json({ status: "All Good" }));

// app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
//   await queue.add("file-upload", JSON.stringify(req.file));
//   res.json({ status: "file uploaded" });
// });

// app.get("/chat", async (req, res) => {
//   const userQuery = req.query.message;

//   const vectorStore = await QdrantVectorStore.fromExistingCollection(
//     {
//       embedDocuments: async (docs) =>
//         Promise.all(docs.map((d) => embedText(d.pageContent))),
//       embedQuery: async (q) => embedText(q),
//     },
//     {
//       url: process.env.QDRANT_URL,
//       collectionName: process.env.QDRANT_COLLECTION,
//     }
//   );

//   const retriever = vectorStore.asRetriever({ k: 3 });
//   const result = await retriever.invoke(userQuery);

//   const systemPrompt = `Use ONLY the following context to answer:\n\n${JSON.stringify(result)}`;

//   const chat = await client.chat.completions.create({
//     model: "llama3-70b-8192",
//     messages: [
//       { role: "system", content: systemPrompt },
//       { role: "user", content: userQuery },
//     ],
//   });

//   res.json({
//     answer: chat.choices[0].message.content,
//     context: result,
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running on ${port}`);
// });



// import express from "express";
// import cors from "cors";
// import multer from "multer";
// import { Queue } from "bullmq";

// import { QdrantVectorStore } from "@langchain/qdrant";
// import Groq from "groq-sdk";

// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// import { pipeline } from "@xenova/transformers";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// // GROQ MODEL CLIENT
// const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // Redis Queue
// const queue = new Queue("file-upload-queue", {
//   connection: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//   },
// });

// const app = express();
// app.use(cors());
// const port = 8000;

// // -------------------------
// // SAME EMBEDDINGS AS WORKER
// // -------------------------
// let embedder = null;

// async function embedText(text) {
//   if (!embedder) {
//     console.log("Loading Xenova MiniLM model for chat...");
//     embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
//     console.log("Chat Model loaded!");
//   }

//   const output = await embedder(text, { pooling: "mean", normalize: true });
//   return Array.from(output.data);
// }

// // -------------------------
// // Multer Setup
// // -------------------------
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage: storage });

// // -------------------------
// // ROUTES
// // -------------------------

// app.get("/", (req, res) => {
//   res.json({ status: "All Good" });
// });

// // Upload PDF → Queue
// app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
//   await queue.add(
//     "file-upload",
//     JSON.stringify({
//       filename: req.file.originalname,
//       destination: req.file.destination,
//       path: req.file.path,
//     })
//   );

//   res.json({ status: "file uploaded" });
// });

// // CHAT API — Search + Generate Answer
// app.get("/chat", async (req, res) => {
//   const userQuery = req.query.message;

//   const vectorStore = await QdrantVectorStore.fromExistingCollection(
//     {
//       embedDocuments: async (docs) =>
//         Promise.all(docs.map((d) => embedText(d.pageContent))),
//       embedQuery: async (query) => embedText(query),
//     },
//     {
//       url: process.env.QDRANT_URL,
//       collectionName: process.env.QDRANT_COLLECTION,
//     }
//   );

//   const retriever = vectorStore.asRetriever({ k: 3 });
//   const result = await retriever.invoke(userQuery);

//   const SYSTEM_PROMPT = `You are a helpful AI assistant. Use ONLY the following PDF content:\n\n${JSON.stringify(
//     result
//   )}`;

//   const chatResult = await client.chat.completions.create({
//     model: "llama-3.3-70b-versatile", // UPDATED MODEL
//     messages: [
//       { role: "system", content: SYSTEM_PROMPT },
//       { role: "user", content: userQuery },
//     ],
//   });

//   res.json({
//     messages: chatResult.choices[0].message.content,
//     doc: result,
//   });
// });

// app.listen(port, () => {
//   console.log(`server is started on PORT: ${port}`);
// });






import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline } from "@xenova/transformers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = 8000;

// ---- ENV ----
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = Number(process.env.REDIS_PORT);

if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY missing in .env");
if (!QDRANT_URL) throw new Error("QDRANT_URL missing in .env");

// ---- Groq client ----
const groqClient = new Groq({ apiKey: GROQ_API_KEY });

// ---- Redis queue ----
const queue = new Queue("file-upload-queue", {
  connection: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

// ---- CORS ----
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// ---- Multer (file upload) ----
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ---- Shared embedder (same as worker.js) ----
let embedder = null;

async function embedText(text) {
  if (!embedder) {
    console.log("⏳ Loading Xenova MiniLM model for chat...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Chat embedding model loaded!");
  }
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

// ---- Routes ----

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "PDF Chat API running" });
});

/**
 * Upload PDF → pushed to BullMQ queue → worker handles embeddings.
 */
app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    await queue.add(
      "file-upload",
      JSON.stringify({
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        destination: req.file.destination,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
      })
    );

    return res.json({
      status: "queued",
      filename: req.file.originalname,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Failed to queue file" });
  }
});

/**
 * GET /chat?message=...
 * Uses Qdrant + Groq to answer from PDF context.
 */
app.get("/chat", async (req, res) => {
  try {
    const userQuery = req.query.message;
    if (!userQuery || typeof userQuery !== "string") {
      return res.status(400).json({ error: "Query parameter 'message' missing" });
    }

    // Retriever with SAME embeddings as worker
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

    const retriever = vectorStore.asRetriever({ k: 3 });
    const result = await retriever.invoke(userQuery);

    const SYSTEM_PROMPT = `You are a helpful assistant that answers questions based ONLY on the following PDF context.

If the answer is not in the context, say "I couldn’t find this information in the uploaded PDF."

Context:
${JSON.stringify(result, null, 2)}
`;

    const chatResult = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userQuery },
      ],
      temperature: 0.2,
      max_tokens: 512,
    });

    const answer = chatResult.choices[0]?.message?.content ?? "";

    return res.json({
      answer,
      context: result,
    });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "Chat failed" });
  }
});

app.listen(port, () => {
  console.log(`🚀 server is started on PORT: ${port}`);
});
