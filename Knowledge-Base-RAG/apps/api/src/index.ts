import { parseConfig } from './config/env';
import { createApp } from './http/server';
import { OllamaAdapter } from './llm/ollama.adapter';
import { RecursiveChunker } from './rag/chunking/recursive';
import { RagPipeline } from './rag/pipeline';
import { createVectorStore } from './vector-store/create-vector-store';

const config = parseConfig();
const ollama = new OllamaAdapter(config.OLLAMA_BASE_URL, config.OLLAMA_CHAT_MODEL, config.OLLAMA_EMBEDDING_MODEL);
const vectorStore = createVectorStore(config);
const ragPipeline = new RagPipeline({
  vectorStore,
  embeddings: ollama,
  chatModel: ollama,
  chunker: new RecursiveChunker(),
});
const { app, port } = createApp({ config, ollama, ragPipeline, vectorStore });

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
