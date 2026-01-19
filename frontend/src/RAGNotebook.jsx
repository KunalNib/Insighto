import React, { useState } from "react";
import { Upload, Trash2, Settings, Send } from "lucide-react";
import axios from "axios";
 import { useClerk } from "@clerk/clerk-react";

export default function RAGNotebook() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const { signOut } = useClerk();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm ready to help you with questions about your uploaded content. What would you like to know?",
    },
  ]);
  const [question, setQuestion] = useState("");

  /* ---------------- PDF HANDLING ---------------- */
  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    setFile(selected);
  }

  function handleClearAll() {
    setFile(null);
    setText("");
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm ready to help you with questions about your uploaded content. What would you like to know?",
      },
    ]);
  }

  async function handleUploadToKnowledgeBase() {
    if (!file && !text.trim()) {
      alert("Please upload a PDF or add text content");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("pdf", file);
    if (text) formData.append("text", text);

    try{
      const res=await axios.post("http://localhost:3000/api/upload", 
        formData,
        {
          headers:{"Content-Type": "multipart/form-data"}
        }
      );
      if(res.data.success){
        alert(res.data.message);
      }
      else{
        alert("error uploading data");
      }

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  }
  async function handleSend() {
    if (!question.trim()) return;

    const userMsg = { role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");

    try {
      const response = await axios.post("http://localhost:3000/api/chat", 
        { question:question },
        {headers: { "Content-Type": "application/json" }}
      );
      if(response.data.error){
        console.log(error);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.answer || "No response" },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error fetching response" },
      ]);
    }
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-zinc-200">

  {/* Top Bar */}
  <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
    <div className="flex items-center gap-2 font-semibold text-lg text-white">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center">
        R
      </div>
      RAG Notebook
    </div>

    <div className="flex items-center gap-4">
      <button className="flex items-center gap-1 text-zinc-400 hover:text-white transition">
        <Settings size={18} /> Settings
      </button>
      <button onClick={()=>signOut()} className="flex items-center gap-1 text-zinc-400 hover:text-white transition">
        Logout
      </button>
     


    </div>
  </header>

  <main className="grid grid-cols-2 gap-6 p-6">

    {/* LEFT PANEL */}
    <section className="bg-zinc-900/80 backdrop-blur rounded-xl border border-zinc-800 p-6 space-y-6 shadow-xl">

      <div>
        <h2 className="font-semibold text-lg text-white">Context & Knowledge Base</h2>
        <p className="text-sm text-zinc-400">
          Add text content and upload PDFs to build your knowledge base
        </p>
      </div>

      <div className="flex gap-3">

        <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-indigo-400 hover:bg-zinc-700 cursor-pointer transition">
          <Upload size={16} /> Upload PDF
          <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
        </label>

        <button
          onClick={handleClearAll}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-red-400 hover:bg-zinc-700 transition"
        >
          <Trash2 size={16} /> Clear All
        </button>

      </div>

      {file && (
        <div className="flex items-center justify-between bg-zinc-800 px-4 py-3 rounded-lg border border-zinc-700 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-semibold">PDF</span>
            {file.name}
            <span className="text-zinc-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
          <button onClick={() => setFile(null)} className="text-zinc-400 hover:text-white">✕</button>
        </div>
      )}

      <div>
        <h3 className="font-medium mb-2 text-white">Text Content</h3>

        <textarea
          className="w-full h-40 p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Add your text content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-zinc-500">{text.length} characters</span>

          <button
            onClick={handleUploadToKnowledgeBase}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            + Add to Knowledge Base
          </button>
        </div>

      </div>

    </section>

    {/* RIGHT PANEL */}
    <section className="bg-zinc-900/80 backdrop-blur rounded-xl border border-zinc-800 p-6 flex flex-col shadow-xl">

      <div className="mb-4">
        <h2 className="font-semibold text-lg text-white">AI Assistant Chat</h2>
        <p className="text-sm text-zinc-400">
          Ask questions about your uploaded content
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg max-w-lg text-sm shadow
              ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white ml-auto"
                  : "bg-zinc-800 text-zinc-200"
              }`}
          >
            {msg.content}
          </div>
        ))}

      </div>

      <div className="mt-4 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2">

        <input
          type="text"
          className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          placeholder="Ask a question about your content..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          className="text-indigo-400 hover:text-indigo-300 transition"
        >
          <Send size={18} />
        </button>

      </div>

    </section>

  </main>

</div>

  );
}
