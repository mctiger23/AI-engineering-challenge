'use client';

import type { KeyboardEvent } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

type ComposerProps = {
  query: string;
  onQueryChange: (next: string) => void;
  onSend: () => void;
  isLoading: boolean;
};

export function Composer({ query, onQueryChange, onSend, isLoading }: ComposerProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && query.trim()) onSend();
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface transition-colors focus-within:border-accent">
      <Textarea
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about your knowledge base…"
        rows={3}
        className="min-h-[96px] rounded-b-none border-0 bg-transparent shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <span className="font-mono text-xs text-muted">⌘ + Enter to send</span>
        <Button onClick={onSend} disabled={!query.trim() || isLoading} size="sm">
          {isLoading ? 'Streaming…' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
