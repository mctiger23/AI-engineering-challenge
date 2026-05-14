'use client';

import { ChangeEvent, useState } from 'react';
import { ingestDocument } from '../../../lib/api-client';

export default function IngestPage() {
  const [sourceName, setSourceName] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit() {
    if (!sourceName.trim() || !content.trim()) return;
    setIsLoading(true);
    try {
      const response = await ingestDocument({ sourceName, content });
      setResult(`Indexed ${response.chunksIndexed} chunks (documentId: ${response.documentId})`);
    } catch (error) {
      setResult(`Failed to ingest: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  function onFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setContent(String(reader.result ?? ''));
      if (!sourceName) setSourceName(file.name);
    };
    reader.readAsText(file);
  }

  return (
    <main style={{ maxWidth: 900, margin: '20px auto', padding: 16 }}>
      <h1>Ingest documents</h1>
      <p>Upload a text file or paste content for indexing.</p>
      <div style={{ display: 'grid', gap: 10 }}>
        <label>
          Source name
          <input value={sourceName} onChange={(e) => setSourceName(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </label>
        <label>
          Upload file
          <input type="file" accept=".txt,.md,.csv,.json" onChange={onFileUpload} />
        </label>
        <label>
          Content
          <textarea rows={16} value={content} onChange={(e) => setContent(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </label>
        <button onClick={onSubmit} disabled={isLoading || !sourceName || !content} style={{ width: 180, padding: 10 }}>
          {isLoading ? 'Indexing…' : 'Ingest & Index'}
        </button>
      </div>
      {result && <pre style={{ marginTop: 12, background: '#fff', padding: 12 }}>{result}</pre>}
    </main>
  );
}
