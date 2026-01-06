import "dotenv/config";
import express from "express";
const app = express();
import cors from "cors";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

import { GoogleGenAI } from "@google/genai";
import multer from "multer";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const upload = multer({
  dest: "uploads", // IMPORTANT
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

app.post("/api/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file && !req.body.text) {
      return res.json({ error: "file not found" });
    }
    const docs = [];
    if (req.file) {
      const loader = new PDFLoader(req.file.path);
      const pdfdocs = await loader.load();
      docs.push(...pdfdocs);
    }
    if (req.body.text) {
      docs.push({
        pageContent: req.body.text,
        metadata: { source: "manual-text" },
      });
    }
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
    });

    const vectorStore = await QdrantVectorStore.fromDocuments(
      docs,
      embeddings,
      {
        url: "http://localhost:63418",
        collectionName: "user-collection",
      }
    );
    console.log("indexing of documents");
    res.status(200).json({ success: true, message: "pdf loaded successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json("something went wrong");
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const userQuery = req.body.question;
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: "http://localhost:63418",
        collectionName: "user-collection",
      }
    );
    const vectorSearcher = await vectorStore.asRetriever({
      k: 3,
    });

    const relevantChunks = await vectorSearcher.invoke(userQuery);

    const SYSTEM_PROMPT = `
    you are an AI assistant who helps resolving user query based on the content available to you from a pdf file with the content and page number.
    only ans based on the availabe context from the file only.

    Context: 
    ${JSON.stringify(relevantChunks)}
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: SYSTEM_PROMPT,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: userQuery,
            },
          ],
        },
      ],
    });
    res.json({ answer: response.text });
  } catch(err) {
    console.log(err);
    res.json({ error: err });
  }
});

app.listen(3000, (req, res) => {
  console.log("app is listening on port 3000");
});
