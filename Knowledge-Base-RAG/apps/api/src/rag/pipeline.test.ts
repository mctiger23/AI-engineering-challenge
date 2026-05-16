import assert from 'node:assert/strict';
import test from 'node:test';
import { RagPipeline } from './pipeline';

test('builds retrieval-backed answers with a custom system prompt', async () => {
  let receivedMessages: unknown;
  const pipeline = new RagPipeline({
    chunker: { chunk: () => [] },
    embeddings: { embed: async () => ({ vectors: [[1, 2, 3]] }) },
    vectorStore: {
      upsert: async () => undefined,
      query: async () => ({ matches: [{ id: 'm1', score: 1, content: 'Ground truth' }] }),
      delete: async () => undefined,
      count: async () => 1,
    },
    chatModel: {
      chat: async (messages) => {
        receivedMessages = messages;
        return { text: 'Answer' };
      },
      async *streamChat() {
        yield { type: 'done' as const };
      },
    },
  });

  const result = await pipeline.ask('Question?', { answer: { systemPrompt: 'Custom system' } });

  assert.equal(result.text, 'Answer');
  assert.equal(result.matches[0]?.content, 'Ground truth');
  assert.deepEqual(receivedMessages, [
    { role: 'system', content: 'Custom system' },
    { role: 'user', content: 'Context:\n[1] Ground truth\n\nQuestion: Question?\nAnswer:' },
  ]);
});
