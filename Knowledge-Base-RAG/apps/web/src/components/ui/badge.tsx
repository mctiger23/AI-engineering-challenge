import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted',
        className
      )}
      {...props}
    />
  );
}
