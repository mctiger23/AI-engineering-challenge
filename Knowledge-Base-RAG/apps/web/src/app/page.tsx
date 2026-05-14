import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <h1>Knowledge Base RAG</h1>
      <ul>
        <li><Link href="/chat">Chat</Link></li>
        <li><Link href="/admin/ingest">Admin Ingest</Link></li>
      </ul>
    </main>
  );
}
