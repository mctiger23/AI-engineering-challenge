import assert from 'node:assert/strict';
import test from 'node:test';
import { createRouter } from './routes';

test('registers the split completion and chat stream routes', () => {
  const router = createRouter({
    ragPipeline: {} as never,
    ollama: {} as never,
    vectorStore: {} as never,
  });

  const paths = router.stack
    .map((layer: { route?: { path?: string } }) => layer.route?.path)
    .filter(Boolean);

  assert.deepEqual(paths, [
    '/api/completions',
    '/api/chat/stream',
    '/api/embeddings',
    '/api/rag/ingest',
    '/api/rag/search',
    '/api/health',
  ]);
});
