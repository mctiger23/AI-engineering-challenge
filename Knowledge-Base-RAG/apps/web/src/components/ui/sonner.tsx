'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      toastOptions={{
        classNames: {
          toast: 'border border-border bg-surface text-foreground',
          description: 'text-muted'
        }
      }}
    />
  );
}
