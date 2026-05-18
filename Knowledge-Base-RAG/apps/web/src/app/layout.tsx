import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from '../components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'RAG desk',
  description: 'Provider-agnostic retrieval-augmented generation workspace',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-sans',
});
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
