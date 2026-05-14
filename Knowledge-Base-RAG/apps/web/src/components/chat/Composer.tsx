'use client';

type ComposerProps = {
  query: string;
  onQueryChange: (next: string) => void;
  onSend: () => void;
  isLoading: boolean;
};

export function Composer({ query, onQueryChange, onSend, isLoading }: ComposerProps) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <textarea
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Ask a question about your knowledge base"
        rows={4}
        style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
      />
      <button onClick={onSend} disabled={!query.trim() || isLoading} style={{ padding: '0 16px', borderRadius: 8 }}>
        {isLoading ? 'Streaming…' : 'Send'}
      </button>
    </div>
  );
}
