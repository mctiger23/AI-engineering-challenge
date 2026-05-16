import { Router, type Request, type Response } from 'express';
import type { OllamaAdapter } from '../llm/ollama.adapter';
import type { RagPipeline } from '../rag/pipeline';
import type { VectorStoreAdapter } from '../vector-store/types';
import {
  ChatStreamRequestSchema,
  CompletionRequestSchema,
  EmbeddingsRequestSchema,
  RagIngestRequestSchema,
  RagSearchRequestSchema,
} from './schemas';

const validate = <T>(schema: { parse: (input: unknown) => T }, payload: unknown): T => schema.parse(payload);
const writeEvent = (res: Response, event: unknown) => res.write(`${JSON.stringify(event)}\n`);

export const createRouter = ({ ragPipeline, ollama, vectorStore }: {
  ragPipeline: RagPipeline;
  ollama: OllamaAdapter;
  vectorStore: VectorStoreAdapter;
}): Router => {
  const router = Router();

  router.post('/api/completions', async (req: Request, res: Response) => {
    try {
      const body = validate<typeof CompletionRequestSchema._type>(CompletionRequestSchema, req.body);
      const result = body.retrieval?.enabled
        ? await ragPipeline.ask(body.prompt, {
            retrieve: { topK: body.retrieval.topK, filter: body.retrieval.filters },
            answer: { systemPrompt: body.systemPrompt, tools: body.tools, toolChoice: body.toolChoice },
          })
        : await ollama.chat(
            [
              ...(body.systemPrompt ? [{ role: 'system' as const, content: body.systemPrompt }] : []),
              { role: 'user' as const, content: body.prompt },
            ],
            { tools: body.tools, toolChoice: body.toolChoice },
          );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.post('/api/chat/stream', async (req: Request, res: Response) => {
    try {
      const body = validate<typeof ChatStreamRequestSchema._type>(ChatStreamRequestSchema, req.body);
      const lastMessage = body.messages[body.messages.length - 1];
      const retrievalEnabled = body.retrieval?.enabled ?? false;
      const question = lastMessage?.content ?? '';
      const matches = retrievalEnabled && question
        ? await ragPipeline.search(question, { topK: body.retrieval?.topK, filter: body.retrieval?.filters })
        : [];
      const retrievalContext = matches.map((match, index) => `[${index + 1}] ${match.content ?? ''}`).join('\n\n');
      const messages = [
        ...(body.systemPrompt ? [{ role: 'system' as const, content: body.systemPrompt }] : []),
        ...body.messages,
        ...(retrievalContext ? [{ role: 'system' as const, content: `Use this retrieved context when useful:\n\n${retrievalContext}` }] : []),
      ];

      res.setHeader('Content-Type', 'application/x-ndjson');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      if (matches.length) writeEvent(res, { type: 'citations', matches });

      for await (const event of ollama.streamChat(messages, { tools: body.tools, toolChoice: body.toolChoice })) {
        writeEvent(res, event);
      }
      res.end();
    } catch (error) {
      if (!res.headersSent) res.status(400);
      if (!res.headersSent) return res.json({ error: (error as Error).message });
      writeEvent(res, { type: 'error', error: (error as Error).message });
      res.end();
    }
  });

  router.post('/api/embeddings', async (req: Request, res: Response) => {
    try {
      const body = validate<typeof EmbeddingsRequestSchema._type>(EmbeddingsRequestSchema, req.body);
      const result = await ollama.embed(body.texts);
      res.json({ vectors: result.vectors });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.post('/api/rag/ingest', async (req: Request, res: Response) => {
    try {
      const body = validate<typeof RagIngestRequestSchema._type>(RagIngestRequestSchema, req.body);
      const result = await ragPipeline.ingest(body.documents.map((document) => ({ id: document.id, content: document.text, metadata: document.metadata })));
      res.json({ ingested: body.documents.length, chunks: result.chunks, upsertedIds: result.upsertedIds });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.post('/api/rag/search', async (req: Request, res: Response) => {
    try {
      const body = validate<typeof RagSearchRequestSchema._type>(RagSearchRequestSchema, req.body);
      const matches = await ragPipeline.search(body.query, { topK: body.topK, filter: body.filters });
      res.json({ matches });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  router.get('/api/health', async (_req, res) => {
    try {
      await ollama.embed(['healthcheck']);
      const storedChunks = await vectorStore.count();
      res.json({ status: 'ok', provider: { llm: 'ollama', embeddings: 'ollama', status: 'ok' }, vectorDb: { provider: 'chroma', status: 'ok', storedChunks } });
    } catch (error) {
      res.json({ status: 'degraded', provider: { llm: 'ollama', embeddings: 'ollama', status: 'error', error: (error as Error).message }, vectorDb: { provider: 'chroma', status: 'unknown' } });
    }
  });

  return router;
};
