# AI Knowledge Inbox

A personal knowledge base with RAG-powered Q&A. Save notes and URLs, then ask questions grounded in your saved content using Google Gemini embeddings and LLM.

## Features

- **Ingest notes** — paste text directly
- **Ingest URLs** — fetch and extract article content via Readability
- **Semantic search** — gemini-embedding-2 with asymmetric RAG prefixes
- **Grounded answers** — gemini-3.1-flash-lite with cited sources
- **Persistent storage** — SQLite with chunk-level embeddings

## Tech Stack

| Layer | Choice |
|-------|--------|
| Backend | Node.js, Express, TypeScript |
| Frontend | React, Vite, Tailwind CSS |
| Database | SQLite (better-sqlite3) |
| Embeddings | gemini-embedding-2 (768 dims) |
| LLM | gemini-3.1-flash-lite |
| Validation | Zod |
| Logging | Pino |

## Local Setup

### Prerequisites

- Node.js 20+
- A [Google AI Studio API key](https://aistudio.google.com/apikey)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your `GEMINI_API_KEY`:

```
GEMINI_API_KEY=your_key_here
PORT=3001
DATABASE_PATH=./data/knowledge.db
NODE_ENV=development
```

### 3. Run in development

```bash
npm run dev
```

This starts:
- **API** at http://localhost:3001
- **Frontend** at http://localhost:5173 (proxies `/api` to backend)

### 4. Build for production

```bash
npm run build
npm start
```

In production mode, Express serves the built frontend from `frontend/dist` and handles all API routes.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/ingest` | Ingest a note or URL |
| `GET` | `/api/items` | List saved items |
| `POST` | `/api/query` | Ask a question (RAG) |

### Example: Ingest a note

```bash
curl -X POST http://localhost:3001/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"type":"note","content":"React hooks let you use state in function components."}'
```

### Example: Query

```bash
curl -X POST http://localhost:3001/api/query \
  -H "Content-Type: application/json" \
  -d '{"question":"What are React hooks?"}'
```

## Railway Deployment

### Prerequisites

- [Railway CLI](https://docs.railway.com/guides/cli) installed
- Google AI Studio API key

### Deploy steps

1. **Link or create a project:**

```bash
railway login
railway link   # or: railway init
```

2. **Set environment variables** in Railway dashboard or CLI:

```
GEMINI_API_KEY=your_key_here
DATABASE_PATH=/data/knowledge.db
NODE_ENV=production
```

3. **Add a volume** mounted at `/data` for SQLite persistence across deploys.

4. **Deploy:**

```bash
railway up -y
```

5. **Generate a public domain:**

```bash
railway domain
```

The `railway.toml` configures build (`npm run build`), start (`node backend/dist/index.js`), and health check (`/api/health`).

## Architecture & Tradeoffs

### What works well (single-user / small scale)

- **SQLite + brute-force cosine similarity** — zero extra infra, persistent, fine for thousands of chunks
- **Synchronous ingest** — simple request/response flow, easy to debug
- **Paragraph-aware chunking** — ~800 chars with 150-char overlap preserves context better than blind splits
- **Asymmetric embedding prefixes** — improves retrieval quality per Gemini docs

### What breaks at scale

| Limitation | Threshold | Mitigation |
|------------|-----------|------------|
| Brute-force vector scan | ~10k+ chunks | ANN index (pgvector, Pinecone, sqlite-vec) |
| Synchronous ingest | High ingest volume | Job queue (BullMQ + Redis) |
| SQLite single-writer | Concurrent writes | Migrate to Postgres |
| No authentication | Multi-tenant use | Add API keys or sessions |

## Project Structure

```
turium/
├── package.json              # npm workspaces root
├── .env.example
├── railway.toml
├── README.md
├── backend/
│   └── src/
│       ├── index.ts          # Server bootstrap
│       ├── app.ts            # Express app + static serve
│       ├── config.ts         # Environment config
│       ├── routes/           # API route handlers
│       ├── services/         # Business logic (ingest, RAG, AI)
│       ├── db/               # Schema + repositories
│       ├── lib/              # Chunker, vector search, logger
│       └── middleware/       # Error handler, validation
└── frontend/
    └── src/
        ├── App.tsx
        ├── api/client.ts
        ├── hooks/
        └── components/
```

## License

MIT
