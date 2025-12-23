import React, { useState } from "react";
import { Upload, Trash2, Settings, Send } from "lucide-react";
import axios from "axios";

export default function RAGNotebook() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
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
      const res=await axios.post("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });
      if(res.success){
        alert("data uploaded to knowledge base successfully");
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
      const data = await axios.post("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "No response" },
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
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            R
          </div>
          RAG Notebook
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
            <Settings size={18} /> Settings
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Save Session
          </button>
        </div>
      </header>

      <main className="grid grid-cols-2 gap-6 p-6">
        <section className="bg-white rounded-xl border p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-lg">Context & Knowledge Base</h2>
            <p className="text-sm text-gray-500">
              Add text content and upload PDFs to build your knowledge base
            </p>
          </div>

          <div className="flex gap-3">
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer">
              <Upload size={16} /> Upload PDF
              <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
            </label>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
            >
              <Trash2 size={16} /> Clear All
            </button>
          </div>

          {file && (
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border text-sm">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-semibold">PDF</span>
                {file.name}
                <span className="text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <button onClick={() => setFile(null)}>✕</button>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Text Content</h3>
            <textarea
              className="w-full h-40 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add your text content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-400">{text.length} characters</span>
              <button
                onClick={handleUploadToKnowledgeBase}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                + Add to Knowledge Base
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="font-semibold text-lg">AI Assistant Chat</h2>
            <p className="text-sm text-gray-500">Ask questions about your uploaded content</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg max-w-lg text-sm ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white ml-auto"
                    : "bg-gray-100"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 border rounded-lg px-3 py-2">
            <input
              type="text"
              className="flex-1 text-sm focus:outline-none"
              placeholder="Ask a question about your content..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="text-indigo-600 hover:text-indigo-800">
              <Send size={18} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
