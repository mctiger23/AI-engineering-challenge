import type { Citation } from '../../lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

type SourcesPanelProps = {
  citations: Citation[];
};

export function SourcesPanel({ citations }: SourcesPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <CardTitle className="text-sm font-medium tracking-wide">Sources</CardTitle>
        </div>
        <CardDescription>Evidence retrieved with the latest answer.</CardDescription>
      </CardHeader>
      <CardContent>
        {citations.length === 0 ? (
          <p className="text-sm text-muted">No citations yet.</p>
        ) : (
          <ul className="list-none p-0">
            {citations.map((citation, i) => (
              <li key={citation.id} className={`grid gap-2 py-4 ${i === 0 ? 'pt-0' : 'border-t border-border'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="font-mono text-xs font-medium text-foreground">{citation.source}</strong>
                  {typeof citation.score === 'number' && (
                    <span className="font-mono text-[10px] text-accent">{citation.score.toFixed(3)}</span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-muted line-clamp-4 whitespace-pre-wrap">{citation.chunk}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
