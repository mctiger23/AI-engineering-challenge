import assert from 'node:assert/strict';
import test from 'node:test';
import { ChatStreamRequestSchema, CompletionRequestSchema } from './schemas';

test('accepts one-shot completion requests with optional assistant controls', () => {
  const parsed = CompletionRequestSchema.parse({
    prompt: 'Summarize this.',
    systemPrompt: 'Be concise.',
    retrieval: { enabled: true, topK: 3 },
    tools: [{ type: 'function', function: { name: 'lookup', description: 'Look up data' } }],
    toolChoice: 'auto',
  });

  assert.equal(parsed.prompt, 'Summarize this.');
  assert.equal(parsed.systemPrompt, 'Be concise.');
  assert.equal(parsed.retrieval?.topK, 3);
  assert.equal(parsed.tools?.[0]?.function.name, 'lookup');
  assert.equal(parsed.toolChoice, 'auto');
});

test('accepts streaming chat requests with session history', () => {
  const parsed = ChatStreamRequestSchema.parse({
    sessionId: 'session-1',
    messages: [{ role: 'user', content: 'Hello' }],
    toolChoice: 'none',
  });

  assert.equal(parsed.sessionId, 'session-1');
  assert.equal(parsed.messages[0]?.content, 'Hello');
  assert.equal(parsed.toolChoice, 'none');
});
