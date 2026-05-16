# Web UI brand refactor implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `apps/web` into a branded shadcn-style application shell with chat, ingest, loading states, and toast feedback.

**Architecture:** Add a small shared design system layer first, then build a reusable shell around feature workspaces. Preserve existing API contracts while reorganizing the frontend into shared UI primitives plus focused chat and ingest components, with inline durable feedback and toast-based transient feedback.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn-style components, Radix UI primitives, Sonner-style toast notifications.

---

## Planned file structure

- `apps/web/package.json` — add styling/UI dependencies.
- `apps/web/components.json` — shadcn configuration.
- `apps/web/postcss.config.mjs`, `apps/web/tailwind.config.ts` — Tailwind pipeline.
- `apps/web/src/app/globals.css` — brand tokens and global styles.
- `apps/web/src/app/layout.tsx` — fonts, global styles, toaster mount.
- `apps/web/src/app/page.tsx` — route entry behavior.
- `apps/web/src/app/chat/page.tsx` — chat workspace composition.
- `apps/web/src/app/admin/ingest/page.tsx` — ingest workspace.
- `apps/web/src/components/layout/AppShell.tsx` — shared navigation shell.
- `apps/web/src/components/chat/*` — chat feature components.
- `apps/web/src/components/ingest/IngestForm.tsx` — ingest feature component.
- `apps/web/src/components/ui/*` — shadcn-style primitives.
- `apps/web/src/lib/utils.ts` — `cn` helper.
- `apps/web/src/lib/api-client.ts` — reused ingest/chat API calls.

### Task 1: Install styling foundation and global brand tokens

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/components.json`
- Create: `apps/web/postcss.config.mjs`
- Create: `apps/web/tailwind.config.ts`
- Create: `apps/web/src/app/globals.css`
- Create: `apps/web/src/lib/utils.ts`
- Modify: `apps/web/src/app/layout.tsx`

- [ ] **Step 1: Add the needed frontend dependencies**

```json
{
  "dependencies": {
    "@radix-ui/react-scroll-area": "^1.2.0",
    "@radix-ui/react-select": "^2.1.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.468.0",
    "sonner": "^1.7.0",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17"
  }
}
```

- [ ] **Step 2: Add Tailwind and shadcn configuration**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        foreground: 'var(--text)',
        muted: 'var(--text-muted)',
        accent: 'var(--accent)',
        navy: 'var(--accent-navy)'
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)']
      }
    }
  },
  plugins: []
} satisfies Config;
```

```js
// postcss.config.mjs
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

```json
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib"
  }
}
```

- [ ] **Step 3: Add brand tokens and shared utility**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0E0E0F;
  --surface: #1A1A1C;
  --border: #2A2A2C;
  --text: #F5F5F4;
  --text-muted: #A1A1A1;
  --accent: #FF5C1A;
  --accent-navy: #1E3A8A;
  --font-heading: 'Inter', Arial, system-ui, sans-serif;
  --font-body: 'IBM Plex Sans', Georgia, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', Consolas, monospace;
}

* {
  border-color: var(--border);
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  line-height: 1.7;
}
```

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Mount global styles and toaster**

```tsx
import type { ReactNode } from 'react';
import { Inter, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from '../components/ui/sonner';
import './globals.css';

const headingFont = Inter({ subsets: ['latin'], variable: '--font-heading' });
const bodyFont = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-body' });
const monoFont = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="min-h-screen bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Run verification**

Run: `yarn workspace @kbrag/web typecheck`  
Expected: PASS after dependencies are installed and config files exist.

- [ ] **Step 6: Commit**

```bash
git add Knowledge-Base-RAG/apps/web
git commit -m "feat: add branded ui foundation"
```

### Task 2: Add shadcn-style primitives and shell layout

**Files:**
- Create: `apps/web/src/components/ui/button.tsx`
- Create: `apps/web/src/components/ui/card.tsx`
- Create: `apps/web/src/components/ui/textarea.tsx`
- Create: `apps/web/src/components/ui/select.tsx`
- Create: `apps/web/src/components/ui/badge.tsx`
- Create: `apps/web/src/components/ui/scroll-area.tsx`
- Create: `apps/web/src/components/ui/sonner.tsx`
- Create: `apps/web/src/components/layout/AppShell.tsx`
- Modify: `apps/web/src/app/page.tsx`

- [ ] **Step 1: Write failing component tests only if the repo already has a test harness**

If no frontend test harness exists, record that and verify these primitives through typecheck/build in later tasks rather than creating a testing stack solely for generated-style primitives.

- [ ] **Step 2: Add focused UI primitives**

Create shadcn-style wrappers for button, card, textarea, select, badge, scroll area, and toaster using the brand-aware class names defined in `globals.css`.

- [ ] **Step 3: Build the reusable shell**

```tsx
export function AppShell({ title, description, children }: AppShellProps) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-background">
      <aside>...</aside>
      <main>
        <header>...</header>
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Make `/` enter the product directly**

```tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/chat');
}
```

- [ ] **Step 5: Verify**

Run: `yarn workspace @kbrag/web typecheck`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add Knowledge-Base-RAG/apps/web
git commit -m "feat: add app shell and ui primitives"
```

### Task 3: Refactor chat into the evidence-desk layout

**Files:**
- Modify: `apps/web/src/app/chat/page.tsx`
- Modify: `apps/web/src/components/chat/Composer.tsx`
- Modify: `apps/web/src/components/chat/MessageList.tsx`
- Modify: `apps/web/src/components/chat/SourcesPanel.tsx`

- [ ] **Step 1: Write the failing behavior test if a test harness exists**

Test the first empty-state rendering and source-pane rendering semantics for chat. If no harness exists, document manual QA steps and proceed with typecheck/build verification.

- [ ] **Step 2: Recompose chat inside `AppShell`**

Use:
- shell header for page title and provider/model selects
- desktop grid for messages and sources
- responsive stacking at smaller breakpoints

- [ ] **Step 3: Replace inline styles with primitives**

Use:
- `Card` for panels
- `Textarea` and `Button` for composer
- `Select` for provider/model
- `ScrollArea` for message list
- `Badge` for role/source metadata

- [ ] **Step 4: Add transient config-load feedback**

When `getRuntimeConfig()` rejects, call:

```ts
toast.error('Unable to load runtime configuration');
```

Keep the page usable where possible, but do not hide the failure.

- [ ] **Step 5: Verify**

Run: `yarn workspace @kbrag/web typecheck`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add Knowledge-Base-RAG/apps/web
git commit -m "feat: refactor chat workspace"
```

### Task 4: Add ingest workspace with durable and transient feedback

**Files:**
- Create: `apps/web/src/app/admin/ingest/page.tsx`
- Create: `apps/web/src/components/ingest/IngestForm.tsx`
- Reuse: `apps/web/src/lib/api-client.ts`

- [ ] **Step 1: Write the failing behavior test if a test harness exists**

Cover:
- successful submit shows result details
- failed submit shows durable inline error

- [ ] **Step 2: Implement ingest form behavior**

Use local state for:
- `sourceName`
- `content`
- `isSubmitting`
- `result`
- `error`

On success:

```ts
toast.success('Document indexed');
setResult(response);
setError(null);
```

On failure:

```ts
toast.error('Unable to index document');
setError(error instanceof Error ? error.message : 'Unable to index document');
```

- [ ] **Step 3: Compose ingest page inside `AppShell`**

Use a two-column desktop layout:
- left: form
- right: guidance / latest result card

- [ ] **Step 4: Verify**

Run: `yarn workspace @kbrag/web typecheck`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add Knowledge-Base-RAG/apps/web
git commit -m "feat: add ingest workspace"
```

### Task 5: Final verification and polish

**Files:**
- Review all changed frontend files.

- [ ] **Step 1: Run static verification**

Run:

```bash
yarn workspace @kbrag/web typecheck
yarn workspace @kbrag/web build
```

Expected: both commands exit successfully.

- [ ] **Step 2: Run manual browser QA**

Verify:
- `/` routes into the app
- `/chat` loads with branded shell
- provider/model controls render
- empty state is visible before first message
- sending a message shows streaming state
- citations render in the source pane
- `/admin/ingest` renders
- ingest submission shows loading state
- successful ingest shows toast plus persistent result
- failed ingest shows toast plus persistent inline error
- layout stacks cleanly at narrow width

- [ ] **Step 3: Commit**

```bash
git add Knowledge-Base-RAG/apps/web Knowledge-Base-RAG/docs/superpowers/specs/2026-05-16-web-ui-brand-refactor-design.md
git commit -m "feat: complete branded web ui refactor"
```
