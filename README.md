# 📚 RAG Notebook

<div align="center">

![RAG Notebook](https://img.shields.io/badge/RAG-Notebook-6366f1?style=for-the-badge&logo=openai&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)

**A modern RAG (Retrieval-Augmented Generation) Chatbot that lets you chat with your PDF documents and text content using AI.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Project Structure](#-project-structure)

</div>

---

## ✨ Features

- 📄 **PDF Upload & Processing** – Upload PDF documents to build your personal knowledge base
- 📝 **Text Content Support** – Add custom text content as additional context
- 🤖 **AI-Powered Chat** – Ask questions about your uploaded content using Google Gemini 2.5 Flash
- 🔍 **Semantic Search** – Uses vector embeddings for intelligent content retrieval
- 🔐 **Authentication** – Secure user authentication via Clerk
- 🎨 **Modern UI** – Beautiful, responsive interface with dark mode and glassmorphism effects
- ⚡ **Real-time Responses** – Fast conversational AI responses

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **Vite 7** | Build Tool & Dev Server |
| **Tailwind CSS 4** | Utility-first CSS styling |
| **Axios** | HTTP Client |
| **Clerk** | Authentication |
| **Lucide React** | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| **Express 5** | Web Framework |
| **LangChain** | LLM Application Framework |
| **Google Gemini 2.5 Flash** | Language Model |
| **Google Text Embedding 004** | Vector Embeddings |
| **Qdrant** | Vector Database |
| **Multer** | File Upload Handling |
| **pdf-parse** | PDF Text Extraction |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ 
- **npm** or **yarn**
- **Qdrant Cloud Account** (or self-hosted Qdrant instance)
- **Google AI API Key**
- **Clerk Account** (for authentication)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/KunalNib/Rag-Chatbot.git
cd RAG-CHATBOT
```

#### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
GOOGLE_API_KEY=your_google_ai_api_key
QDRANT_URL=your_qdrant_cloud_url
QDRANT_API_KEY=your_qdrant_api_key
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:3000`

#### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 📖 API Reference

### Upload Content

```http
POST /api/upload
```

Upload a PDF file and/or text content to the knowledge base.

| Parameter | Type | Description |
|-----------|------|-------------|
| `pdf` | `file` | PDF file to upload (optional) |
| `text` | `string` | Text content to add (optional) |

**Response:**
```json
{
  "success": true,
  "message": "pdf loaded successfully"
}
```

---

### Chat with AI

```http
POST /api/chat
```

Ask a question about the uploaded content.

| Parameter | Type | Description |
|-----------|------|-------------|
| `question` | `string` | The question to ask |

**Response:**
```json
{
  "answer": "AI-generated response based on your content"
}
```

---

## 📁 Project Structure

```
RAG-CHATBOT/
├── backend/
│   ├── index.js          # Express server & API routes
│   ├── uploads/          # Uploaded PDF storage
│   ├── package.json
│   └── .env              # Backend environment variables
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main app with auth routing
│   │   ├── RAGNotebook.jsx   # Main RAG interface component
│   │   ├── main.jsx          # App entry point with Clerk
│   │   ├── App.css           # App styles
│   │   └── index.css         # Global styles
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env              # Frontend environment variables
│
└── README.md
```

---

## 🔧 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        RAG PIPELINE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. INGESTION                                                   │
│     ┌──────────┐    ┌──────────────┐    ┌──────────────────┐   │
│     │  PDF /   │───▶│  LangChain   │───▶│  Google Text     │   │
│     │  Text    │    │  PDFLoader   │    │  Embedding-004   │   │
│     └──────────┘    └──────────────┘    └────────┬─────────┘   │
│                                                   │             │
│                                                   ▼             │
│                                          ┌──────────────────┐   │
│                                          │  Qdrant Vector   │   │
│                                          │  Database        │   │
│                                          └────────┬─────────┘   │
│                                                   │             │
│  2. RETRIEVAL & GENERATION                        │             │
│     ┌──────────┐    ┌──────────────┐              │             │
│     │  User    │───▶│  Semantic    │◀─────────────┘             │
│     │  Query   │    │  Search (k=3)│                            │
│     └──────────┘    └──────┬───────┘                            │
│                            │                                    │
│                            ▼                                    │
│                    ┌──────────────────┐    ┌──────────────────┐ │
│                    │  Context +       │───▶│  Google Gemini   │ │
│                    │  System Prompt   │    │  2.5 Flash       │ │
│                    └──────────────────┘    └────────┬─────────┘ │
│                                                      │          │
│                                                      ▼          │
│                                              ┌──────────────┐   │
│                                              │  AI Response │   │
│                                              └──────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Screenshots

The application features a modern dark-themed interface with:

- **Split-panel layout** – Left panel for content upload, right panel for chat
- **Gradient accents** – Indigo to purple gradients for branding
- **Glassmorphism effects** – Subtle backdrop blur and transparency
- **Real-time chat** – User and AI messages styled distinctively

---

## 🔐 Environment Variables

### Backend (`.env`)

| Variable | Description |
|----------|-------------|
| `GOOGLE_API_KEY` | Your Google AI API key for Gemini & Embeddings |
| `QDRANT_URL` | Qdrant Cloud cluster URL |
| `QDRANT_API_KEY` | Qdrant API key for authentication |

### Frontend (`.env`)

| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for auth |

---

## 📜 Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm start` | Start server with nodemon (hot-reload) |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 🙏 Acknowledgements

- [LangChain](https://www.langchain.com/) – for the amazing RAG framework
- [Google AI](https://ai.google.dev/) – for Gemini LLM and embeddings
- [Qdrant](https://qdrant.tech/) – for the vector database
- [Clerk](https://clerk.com/) – for authentication
- [Vite](https://vitejs.dev/) – for the blazing fast dev experience

---

<div align="center">

**Made with ❤️ by [Kunal](https://github.com/KunalNib)**

</div>
