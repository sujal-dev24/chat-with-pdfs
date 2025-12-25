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
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 uploads folder created");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = 8000;

// ---- ENV ----
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION;

if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY missing in .env");
if (!QDRANT_URL) throw new Error("QDRANT_URL missing in .env");

// ---- Groq client ----
const groqClient = new Groq({ apiKey: GROQ_API_KEY });

// ---- Redis queue ----
const queue = new Queue("file-upload-queue", {
  connection: {
    url: process.env.REDIS_URL,
  },
});

// ---- CORS ----
app.use(
  cors({
    origin: [
      "https://chat-with-pdfs-self.vercel.app",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

// ---- Multer (file upload) ----
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
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
      return res
        .status(400)
        .json({ error: "Query parameter 'message' missing" });
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
