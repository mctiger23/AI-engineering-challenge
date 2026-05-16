'use client';

import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

type ComposerProps = {
  query: string;
  onQueryChange: (next: string) => void;
  onSend: () => void;
  isLoading: boolean;
};

export function Composer({ query, onQueryChange, onSend, isLoading }: ComposerProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end">
      <Textarea
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Ask a question about your knowledge base"
        rows={4}
        className="min-h-[132px] flex-1"
      />
      <Button onClick={onSend} disabled={!query.trim() || isLoading} className="md:min-w-28">
        {isLoading ? 'Streaming…' : 'Send'}
      </Button>
    </div>
  );
}
