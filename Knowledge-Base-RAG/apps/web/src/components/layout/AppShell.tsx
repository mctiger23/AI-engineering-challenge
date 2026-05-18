'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type AppShellProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

const navItems = [
  { href: '/chat', label: 'Chat' },
  { href: '/admin/ingest', label: 'Ingest' }
];

export function AppShell({ title, description, actions, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="border-b border-border bg-navy-deep px-5 py-6 lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="mb-8">
          <p className="mb-2 font-mono text-xs text-muted">knowledge base</p>
          <h1 className="flex items-center gap-2 text-xl">
            <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
            RAG desk
          </h1>
        </div>
        <nav className="flex gap-2 lg:flex-col">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-xl border px-4 py-3 text-sm transition-colors',
                  active
                    ? 'border-accent bg-accent text-background'
                    : 'border-transparent text-muted hover:border-border hover:bg-surface hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="min-w-0">
        <header className="border-b border-border px-5 py-6 md:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-3xl">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
            </div>
            {actions}
          </div>
        </header>
        <main className="px-5 py-6 md:px-8">{children}</main>
      </section>
    </div>
  );
}
