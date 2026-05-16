import assert from 'node:assert/strict';
import test from 'node:test';
import { ChromaAdapter } from './chroma.adapter';

test('creates collections without a Chroma embedding function when vectors are supplied externally', async () => {
  let received: unknown;
  const fakeCollection = { count: async () => 0 };
  const fakeClient = {
    getOrCreateCollection: async (input: unknown) => {
      received = input;
      return fakeCollection;
    },
  };

  const adapter = new ChromaAdapter(fakeClient as never, 'knowledge_base');
  await adapter.count();

  assert.deepEqual(received, { name: 'knowledge_base', embeddingFunction: null });
});
