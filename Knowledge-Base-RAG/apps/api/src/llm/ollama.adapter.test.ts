import assert from 'node:assert/strict';
import test from 'node:test';
import { OllamaAdapter } from './ollama.adapter';

test('normalizes streamed Ollama chat chunks into delta and tool-call events', async () => {
  const lines = [
    JSON.stringify({ message: { content: 'Hello' }, done: false }),
    JSON.stringify({ message: { tool_calls: [{ function: { name: 'lookup', arguments: { id: '1' } } }] }, done: false }),
    JSON.stringify({ done: true }),
  ].join('\n');

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(lines) as Response;

  try {
    const adapter = new OllamaAdapter('http://localhost:11434', 'llama3.1', 'nomic-embed-text');
    const events = [];
    for await (const event of adapter.streamChat([{ role: 'user', content: 'Hi' }])) events.push(event);

    assert.deepEqual(events, [
      { type: 'delta', text: 'Hello' },
      { type: 'tool_call', toolCall: { function: { name: 'lookup', arguments: { id: '1' } } } },
      { type: 'done' },
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
