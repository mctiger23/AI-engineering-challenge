# Knowledge-Base-RAG Monorepo

A TypeScript-first workspace layout for building a retrieval-augmented generation (RAG) application with:

- `apps/web`: Next.js frontend
- `apps/api`: Express backend (optional)
- `packages/*`: shared libraries for RAG orchestration, adapters, and shared contracts

## Workspace Structure

```text
Knowledge-Base-RAG/
├─ apps/
│  ├─ web/
│  └─ api/
├─ packages/
│  ├─ llm-adapters/
│  ├─ rag-core/
│  ├─ vector-store/
│  └─ shared/
├─ .env.example
├─ .gitignore
├─ package.json
├─ README.md
└─ tsconfig.base.json
```

## Startup Modes

### 1) Next.js frontend + Express backend

Use this mode when you want a separate API service for ingestion, indexing, and retrieval.

1. Install dependencies in repo root:
   ```bash
   npm install
   ```
2. Run API service:
   ```bash
   npm run dev:api
   ```
3. In another terminal, run Next.js app:
   ```bash
   npm run dev:web
   ```
4. Ensure `.env` points `NEXT_PUBLIC_API_BASE_URL` to the Express server (default: `http://localhost:4000`).

### 2) Next.js frontend + Next API routes only

Use this mode when you want a single deployment unit with API handlers inside Next.js.

1. Install dependencies in repo root:
   ```bash
   npm install
   ```
2. Build routes under `apps/web/src/app/api` or `apps/web/pages/api`.
3. Run only Next.js app:
   ```bash
   npm run dev:web
   ```
4. Set `RAG_APP_MODE=next-api` in `.env`.

## Notes

- `apps/api` is optional if all API logic is implemented with Next API routes.
- Package path aliases are defined in `tsconfig.base.json`.
- Add provider-specific env vars before calling external LLM or vector services.
