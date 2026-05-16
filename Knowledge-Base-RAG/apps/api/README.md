# API Backend

`apps/api` is the backend root for the local-first RAG application. It owns the full retrieval path: Ollama generates chat responses and embeddings, Chroma persists vectors, and the API composes ingestion, retrieval, and answer generation behind stable HTTP endpoints.

## Local stack

- **Express** serves the HTTP API.
- **Ollama** provides chat completions and embeddings.
- **Chroma** stores document chunks and vectors locally.

Required services:

```bash
ollama serve
chroma run --path ./chroma-data --host localhost --port 8000
```

Install dependencies and start the API from the repository root:

```bash
yarn install
yarn dev:api
```

## Configuration

Copy `.env.example` to `.env` and adjust values when needed:

| Variable | Purpose | Default |
| --- | --- | --- |
| `API_PORT` | Express port | `4000` |
| `OLLAMA_BASE_URL` | Ollama server URL | `http://localhost:11434` |
| `OLLAMA_CHAT_MODEL` | Chat model | `llama3.1` |
| `OLLAMA_EMBEDDING_MODEL` | Embedding model | `nomic-embed-text` |
| `CHROMA_URL` | Chroma server URL | `http://localhost:8000` |
| `CHROMA_COLLECTION` | Chroma collection name | `knowledge_base` |

## Folder map

```text
src/
├─ config/        # env parsing and runtime settings
├─ http/          # Express app, routes, and request schemas
├─ llm/           # Ollama adapter and LLM/embedding interfaces
├─ rag/           # chunking, ingestion, retrieval, prompts, orchestration
└─ vector-store/  # Chroma adapter and vector contracts
```

## RAG lifecycle

```text
ingest request
  -> recursive chunking
  -> Ollama embeddings
  -> Chroma upsert

chat/search request
  -> Ollama query embedding
  -> Chroma similarity search
  -> retrieved context
  -> Ollama answer generation
```

## Endpoints

- `POST /api/completions` — generate a one-shot JSON response
- `POST /api/chat/stream` — stream structured chat events for conversational UIs
- `POST /api/embeddings` — generate embeddings with Ollama
- `POST /api/rag/ingest` — chunk, embed, and persist documents
- `POST /api/rag/search` — retrieve the most relevant stored chunks
- `GET /api/health` — report local provider health

## Troubleshooting

- If chat or embeddings fail, verify Ollama is running and that the configured models are installed.
- If ingestion or search fails, verify Chroma is reachable at `CHROMA_URL`.
- If responses contain no retrieved context, ingest documents first and confirm the same `CHROMA_COLLECTION` is used across runs.


## Chat APIs

### One-shot completion

```bash
curl -X POST http://localhost:4000/api/completions \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Summarize the indexed material.",
    "systemPrompt": "Be concise.",
    "retrieval": { "enabled": true, "topK": 3 },
    "tools": [],
    "toolChoice": "auto"
  }'
```

### Streaming chat

```bash
curl -N -X POST http://localhost:4000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "demo-session",
    "messages": [{ "role": "user", "content": "What changed?" }],
    "systemPrompt": "You are a helpful assistant.",
    "retrieval": { "enabled": true, "topK": 3 },
    "tools": [],
    "toolChoice": "auto"
  }'
```

Streaming responses are newline-delimited JSON events such as:

```json
{ "type": "citations", "matches": [] }
{ "type": "delta", "text": "Hello" }
{ "type": "tool_call", "toolCall": { "function": { "name": "lookup" } } }
{ "type": "done" }
```

`tools` and `toolChoice` are forwarded to Ollama so the model can request tool use. The API does not execute tools yet; it only surfaces tool-call intents to callers.
