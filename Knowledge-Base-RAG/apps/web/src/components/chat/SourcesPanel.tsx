import type { Citation } from '../../lib/api-client';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

type SourcesPanelProps = {
  citations: Citation[];
};

export function SourcesPanel({ citations }: SourcesPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Retrieved sources</CardTitle>
        <CardDescription>Evidence returned with the latest answer.</CardDescription>
      </CardHeader>
      <CardContent>
        {citations.length === 0 && <p className="text-sm text-muted">No citations received yet.</p>}
        <ul className="grid list-none gap-3 p-0">
          {citations.map((citation) => (
            <li key={citation.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="font-medium">{citation.source}</strong>
                {typeof citation.score === 'number' && <Badge>score {citation.score.toFixed(3)}</Badge>}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-muted">{citation.chunk}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
