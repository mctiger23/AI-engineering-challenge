'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AppShell } from '../../components/layout/AppShell';
import { Composer } from '../../components/chat/Composer';
import { MessageList } from '../../components/chat/MessageList';
import { SourcesPanel } from '../../components/chat/SourcesPanel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
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
      .catch(() => {
        toast.error('Unable to load runtime configuration');
      });
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
    <AppShell
      title="RAG chat"
      description="Ask questions against your local knowledge base and inspect the retrieved evidence beside each answer."
      actions={
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="min-w-44">
            <p className="mb-2 text-xs text-muted">Provider</p>
            <Select
              value={provider}
              onValueChange={(nextProvider) => {
                setProvider(nextProvider);
                const providerConfig = providers.find((p) => p.id === nextProvider);
                setModel(providerConfig?.defaultModel ?? providerConfig?.models[0] ?? '');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-44">
            <p className="mb-2 text-xs text-muted">Model</p>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {(selectedProvider?.models ?? []).map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <div className="grid gap-4">
          <MessageList messages={messages} />
          <Composer query={query} onQueryChange={setQuery} onSend={onSend} isLoading={isLoading} />
        </div>
        <SourcesPanel citations={citations} />
      </div>
    </AppShell>
  );
}
