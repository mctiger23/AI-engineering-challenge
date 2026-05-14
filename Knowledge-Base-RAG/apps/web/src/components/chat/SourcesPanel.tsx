import type { Citation } from '../../lib/api-client';

type SourcesPanelProps = {
  citations: Citation[];
};

export function SourcesPanel({ citations }: SourcesPanelProps) {
  return (
    <aside style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>Retrieved sources</h3>
      {citations.length === 0 && <p style={{ opacity: 0.7 }}>No citations received yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
        {citations.map((citation) => (
          <li key={citation.id} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 8 }}>
            <strong>{citation.source}</strong>
            {typeof citation.score === 'number' && <div style={{ fontSize: 12 }}>score: {citation.score.toFixed(3)}</div>}
            <p style={{ margin: '6px 0 0', fontSize: 14, whiteSpace: 'pre-wrap' }}>{citation.chunk}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
