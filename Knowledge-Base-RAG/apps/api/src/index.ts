import cors from 'cors';
import express, { Request, Response } from 'express';
import { createChatAdapter, createEmbeddingAdapter } from '../../../packages/llm-adapters/src/adapter-factory';
import {
  ChatRequestSchema,
  EmbeddingsRequestSchema,
  RagIngestRequestSchema,
  RagSearchRequestSchema,
  VectorFilterSchema,
} from '../../../packages/shared/src/types/api';
import { VectorFilter, VectorMetadata } from '../../../packages/shared/src/types/vector';

type StoredChunk = {
  id: string;
  content: string;
  metadata?: VectorMetadata;
  vector: number[];
};

const app = express();
const port = Number(process.env.API_PORT ?? 4000);
const chatAdapter = createChatAdapter(process.env);
const embeddingAdapter = createEmbeddingAdapter(process.env);
const vectorStore = new Map<string, StoredChunk>();

app.use(cors());
app.use(express.json());

const chunkText = (text: string, maxChunk = 500): string[] => {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxChunk));
    i += maxChunk;
  }
  return chunks.length ? chunks : [text];
};

const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
};

const matchesFilters = (metadata: VectorMetadata | undefined, filters: VectorFilter | undefined): boolean => {
  if (!filters) return true;
  return Object.entries(filters).every(([k, filter]) => {
    const value = metadata?.[k];
    if (filter && typeof filter === 'object' && !Array.isArray(filter)) {
      if ('eq' in filter && filter.eq !== undefined) return value === filter.eq;
      if ('in' in filter && filter.in !== undefined) return filter.in.includes(value as never);
      if (typeof value !== 'number') return false;
      if ('gt' in filter && filter.gt !== undefined && !(value > filter.gt)) return false;
      if ('gte' in filter && filter.gte !== undefined && !(value >= filter.gte)) return false;
      if ('lt' in filter && filter.lt !== undefined && !(value < filter.lt)) return false;
      if ('lte' in filter && filter.lte !== undefined && !(value <= filter.lte)) return false;
      return true;
    }
    if (Array.isArray(filter)) return filter.includes(value as never);
    return value === filter;
  });
};

const validate = <T,>(schema: { parse: (v: unknown) => T }, payload: unknown): T => schema.parse(payload);

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const body = validate(ChatRequestSchema, req.body);
    const retrievalEnabled = body.retrieval?.enabled ?? false;

    let retrievalContext = '';
    if (retrievalEnabled) {
      const query = body.messages[body.messages.length - 1]?.content ?? '';
      if (query) {
        const { vectors } = await embeddingAdapter.embed([query]);
        const queryVector = vectors[0] ?? [];
        const topK = body.retrieval?.topK ?? 5;
        const filters = body.retrieval?.filters ? validate(VectorFilterSchema, body.retrieval.filters) : undefined;
        const matches = Array.from(vectorStore.values())
          .filter((chunk) => matchesFilters(chunk.metadata, filters))
          .map((chunk) => ({ ...chunk, score: cosineSimilarity(queryVector, chunk.vector) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, topK);
        retrievalContext = matches.map((m, i) => `[${i + 1}] ${m.content}`).join('\n\n');
      }
    }

    const finalMessages = retrievalContext
      ? [
          ...body.messages,
          { role: 'system' as const, content: `Use this retrieved context when useful:\n\n${retrievalContext}` },
        ]
      : body.messages;

    const completion = await chatAdapter.chat(finalMessages);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const tokens = completion.text.split(/(\s+)/).filter(Boolean);
    for (const token of tokens) {
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post('/api/embeddings', async (req: Request, res: Response) => {
  try {
    const body = validate(EmbeddingsRequestSchema, req.body);
    const result = await embeddingAdapter.embed(body.texts);
    res.json({ vectors: result.vectors });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post('/api/rag/ingest', async (req: Request, res: Response) => {
  try {
    const body = validate(RagIngestRequestSchema, req.body);
    const pending: Array<{ id: string; content: string; metadata?: VectorMetadata }> = [];

    for (const document of body.documents) {
      const parts = chunkText(document.text);
      parts.forEach((content, i) => {
        pending.push({
          id: `${document.id}::${i}`,
          content,
          metadata: { ...(document.metadata ?? {}), sourceDocumentId: document.id },
        });
      });
    }

    const { vectors } = await embeddingAdapter.embed(pending.map((p) => p.content));
    pending.forEach((item, idx) => {
      vectorStore.set(item.id, { ...item, vector: vectors[idx] ?? [] });
    });

    res.json({ ingested: body.documents.length, chunks: pending.length, upsertedIds: pending.map((p) => p.id) });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post('/api/rag/search', async (req: Request, res: Response) => {
  try {
    const body = validate(RagSearchRequestSchema, req.body);
    const { vectors } = await embeddingAdapter.embed([body.query]);
    const queryVector = vectors[0] ?? [];

    const matches = Array.from(vectorStore.values())
      .filter((chunk) => matchesFilters(chunk.metadata, body.filters))
      .map((chunk) => ({
        id: chunk.id,
        score: cosineSimilarity(queryVector, chunk.vector),
        content: chunk.content,
        metadata: chunk.metadata,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, body.topK);

    res.json({ matches });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/api/health', async (_req, res) => {
  const provider = process.env.LLM_PROVIDER ?? 'unknown';
  const embeddingProvider = process.env.EMBEDDING_PROVIDER ?? 'unknown';

  let providerStatus: 'ok' | 'error' = 'ok';
  let providerError: string | undefined;
  try {
    await embeddingAdapter.embed(['healthcheck']);
  } catch (error) {
    providerStatus = 'error';
    providerError = (error as Error).message;
  }

  res.json({
    status: providerStatus === 'ok' ? 'ok' : 'degraded',
    provider: { llm: provider, embeddings: embeddingProvider, status: providerStatus, error: providerError },
    vectorDb: { provider: process.env.VECTOR_DB_PROVIDER ?? 'in-memory', status: 'ok', storedChunks: vectorStore.size },
  });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
