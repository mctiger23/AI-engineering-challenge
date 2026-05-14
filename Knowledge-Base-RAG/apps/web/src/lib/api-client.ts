export type ProviderOption = {
  id: string;
  label: string;
  models: string[];
  defaultModel?: string;
};

export type RuntimeConfig = {
  providers: ProviderOption[];
  defaultProviderId?: string;
};

export type Citation = {
  id: string;
  source: string;
  chunk: string;
  score?: number;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
  citations?: Citation[];
};

export type ChatRequest = {
  query: string;
  provider: string;
  model: string;
  chatHistory?: ChatMessage[];
};

export type IngestPayload = {
  sourceName: string;
  content: string;
  metadata?: Record<string, string>;
};

export type IngestResponse = {
  documentId: string;
  chunksIndexed: number;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getRuntimeConfig(): Promise<RuntimeConfig> {
  return request<RuntimeConfig>('/config/providers');
}

export async function ingestDocument(payload: IngestPayload): Promise<IngestResponse> {
  return request<IngestResponse>('/ingest', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function streamChat(
  payload: ChatRequest,
  onDelta: (delta: string) => void,
  onCitations: (citations: Citation[]) => void
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok || !response.body) {
    throw new Error(`Chat stream failed (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const event = JSON.parse(line) as
          | { type: 'delta'; text: string }
          | { type: 'citations'; citations: Citation[] }
          | { type: 'done' };

        if (event.type === 'delta') onDelta(event.text);
        if (event.type === 'citations') onCitations(event.citations);
      } catch {
        const normalized = line.replace(/^data:\s?/, '');
        if (normalized) onDelta(normalized);
      }
    }
  }
}
