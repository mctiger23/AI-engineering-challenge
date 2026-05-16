import assert from 'node:assert/strict';
import test from 'node:test';
import { toChromaClientArgs } from './create-vector-store';

test('maps a Chroma URL to host, port, and ssl client args', () => {
  assert.deepEqual(toChromaClientArgs('http://localhost:8000'), {
    host: 'localhost',
    port: 8000,
    ssl: false,
  });
});
