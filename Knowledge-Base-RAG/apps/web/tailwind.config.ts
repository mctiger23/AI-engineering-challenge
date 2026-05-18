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
        navy: 'var(--accent-navy)',
        'navy-deep': 'var(--bg-navy)'
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
