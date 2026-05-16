# Knowledge-Base-RAG Monorepo

A local-first retrieval-augmented generation (RAG) application with:

- `apps/web`: Next.js frontend
- `apps/api`: Express backend that owns Ollama integration, Chroma persistence, and the RAG pipeline

## Workspace Structure

```text
Knowledge-Base-RAG/
├─ apps/
│  ├─ web/
│  └─ api/
├─ .env.example
├─ package.json
├─ yarn.lock
└─ tsconfig.base.json
```

## Local Development

1. Install dependencies:
   ```bash
   yarn install
   ```
2. Start Ollama and Chroma locally.
3. Copy `.env.example` to `.env` and adjust models or ports if needed.
4. Run the API:
   ```bash
   yarn dev:api
   ```
5. In another terminal, run the web app:
   ```bash
   yarn dev:web
   ```

See [`apps/api/README.md`](./apps/api/README.md) for backend architecture, endpoints, and local service details.
