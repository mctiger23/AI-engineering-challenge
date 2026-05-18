'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ingestDocument, type IngestResponse } from '../../lib/api-client';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export function IngestForm() {
  const [sourceName, setSourceName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<IngestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!sourceName.trim() || !content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await ingestDocument({ sourceName, content });
      setResult(response);
      toast.success('Document indexed');
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unable to index document';
      setError(message);
      toast.error('Unable to index document');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Index a document</CardTitle>
          <CardDescription>Add source material to the local knowledge base.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="text-muted">Source name</span>
            <Input
              value={sourceName}
              onChange={(event) => setSourceName(event.target.value)}
              placeholder="quarterly-report.md"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-muted">Document content</span>
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Paste the document text here"
              className="min-h-[280px]"
            />
          </label>

          {error && (
            <div className="rounded-xl border border-accent/40 bg-background p-4 text-sm text-foreground">
              {error}
            </div>
          )}

          <Button onClick={onSubmit} disabled={!sourceName.trim() || !content.trim() || isSubmitting}>
            {isSubmitting ? 'Indexing…' : 'Index document'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest result</CardTitle>
          <CardDescription>Durable feedback remains here after the toast fades.</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <dl className="grid gap-4 text-sm">
              <div>
                <dt className="text-muted">Document id</dt>
                <dd className="mt-1 font-mono">{result.documentId}</dd>
              </div>
              <div>
                <dt className="text-muted">Chunks indexed</dt>
                <dd className="mt-1 text-2xl font-semibold">{result.chunksIndexed}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted">No document has been indexed in this session yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
