# Chat and Completions API Design

## Summary

Split conversational and one-shot generation into distinct API routes while keeping the backend local-first and API-owned. `POST /api/completions` will serve single-prompt requests with JSON responses, and `POST /api/chat/stream` will serve chat UIs with structured streaming events.

## API Shape

### `POST /api/completions`

A one-shot generation endpoint for callers that have a prompt rather than conversation history.

```json
{
  "prompt": "Summarize this document.",
  "systemPrompt": "You are concise.",
  "retrieval": { "enabled": true, "topK": 5 },
  "tools": [],
  "toolChoice": "auto"
}
```

Returns JSON containing the generated text plus any retrieval matches/tool calls surfaced by the model.

### `POST /api/chat/stream`

A conversational endpoint for chat interfaces.

```json
{
  "sessionId": "session-1",
  "messages": [{ "role": "user", "content": "What changed?" }],
  "systemPrompt": "You are a helpful assistant.",
  "retrieval": { "enabled": true, "topK": 5 },
  "tools": [],
  "toolChoice": "auto"
}
```

Streams newline-delimited JSON events:

- `delta` — assistant text token/chunk
- `tool_call` — model-requested tool invocation metadata
- `citations` — retrieved sources when RAG is used
- `done` — turn completion
- `error` — stream-safe failure payload

The existing `POST /api/chat` route is replaced by this clearer split rather than preserved as a third overlapping chat concept.

## Capability Boundaries

- `systemPrompt` is optional on both routes; omitted values fall back to the backend default prompt.
- `retrieval` is optional on both routes and reuses the current RAG pipeline.
- `tools` and `toolChoice` are accepted and forwarded to Ollama so the model can emit tool-call intents.
- The backend does **not** execute tools in this phase. Tool execution remains a later concern requiring an explicit registry, permissions, validation, retries, and orchestration loop.

## Internal Design

- Extend the Ollama adapter with streaming support and tool-aware request payloads.
- Add separate request schemas for completion and streaming chat use cases.
- Keep retrieval orchestration in the RAG layer, but expose results in a way the HTTP layer can stream citations before or alongside answer content.
- Keep `/api/embeddings`, `/api/rag/ingest`, `/api/rag/search`, and `/api/health` unchanged.
- Update backend documentation so payload examples make the chat/completion distinction obvious and reduce accidental `400` responses from malformed requests.

## Validation and Errors

- Completion requests must provide a non-empty `prompt`.
- Chat stream requests must provide non-empty `sessionId` and at least one valid message.
- Invalid payloads return HTTP `400` before model invocation.
- Stream-time failures are emitted as `error` events and followed by `done` only when appropriate.

## Testing

- Add focused coverage for request validation, Ollama streaming parsing, and emitted HTTP stream events.
- Verify existing RAG ingestion/search behavior remains intact.
- Update docs examples and manually smoke-test both new routes against local Ollama.
