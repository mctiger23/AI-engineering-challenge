'use client';

import { useEffect, useMemo, useState } from 'react';
import { Composer } from '../../components/chat/Composer';
import { MessageList } from '../../components/chat/MessageList';
import { SourcesPanel } from '../../components/chat/SourcesPanel';
import { ChatMessage, Citation, ProviderOption, getRuntimeConfig, streamChat } from '../../lib/api-client';

function uid() {
  return Math.random().toString(36).slice(2);
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [query, setQuery] = useState('');
  const [providers, setProviders] = useState<ProviderOption[]>([]);
  const [provider, setProvider] = useState('');
  const [model, setModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getRuntimeConfig()
      .then((config) => {
        setProviders(config.providers);
        const selectedProviderId = config.defaultProviderId ?? config.providers[0]?.id ?? '';
        setProvider(selectedProviderId);
        const selectedProvider = config.providers.find((p) => p.id === selectedProviderId);
        setModel(selectedProvider?.defaultModel ?? selectedProvider?.models[0] ?? '');
      })
      .catch(() => undefined);
  }, []);

  const selectedProvider = useMemo(() => providers.find((p) => p.id === provider), [providers, provider]);

  async function onSend() {
    if (!query.trim() || !provider || !model || isLoading) return;
    setIsLoading(true);
    setCitations([]);

    const userMessage: ChatMessage = { id: uid(), role: 'user', content: query };
    const assistantId = uid();
    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      await streamChat(
        { query, provider, model, chatHistory: messages },
        (delta) => {
          setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + delta } : m)));
        },
        (nextCitations) => {
          setCitations(nextCitations);
          setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, citations: nextCitations } : m)));
        }
      );
    } catch (error) {
      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: `Error: ${String(error)}` } : m)));
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  }

  return (
    <main style={{ maxWidth: 1100, margin: '20px auto', padding: 16 }}>
      <h1>RAG Chat</h1>
      <p>Runtime provider/model selection is loaded from server-safe configuration (no secrets exposed).</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <label>
          Provider
          <select
            value={provider}
            onChange={(e) => {
              const nextProvider = e.target.value;
              setProvider(nextProvider);
              const providerConfig = providers.find((p) => p.id === nextProvider);
              setModel(providerConfig?.defaultModel ?? providerConfig?.models[0] ?? '');
            }}
            style={{ marginLeft: 8 }}
          >
            {providers.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </label>

        <label>
          Model
          <select value={model} onChange={(e) => setModel(e.target.value)} style={{ marginLeft: 8 }}>
            {(selectedProvider?.models ?? []).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <MessageList messages={messages} />
          <Composer query={query} onQueryChange={setQuery} onSend={onSend} isLoading={isLoading} />
        </div>
        <SourcesPanel citations={citations} />
      </div>
    </main>
  );
}
