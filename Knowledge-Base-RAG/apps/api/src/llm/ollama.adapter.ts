import type {
  ChatMessage,
  ChatModel,
  ChatOptions,
  ChatResult,
  ChatStreamEvent,
  EmbeddingModel,
  EmbeddingOptions,
  EmbeddingResult,
  ToolCall,
} from './types';

export class OllamaAdapter implements ChatModel, EmbeddingModel {
  constructor(
    private readonly baseUrl: string,
    private readonly defaultChatModel: string,
    private readonly defaultEmbeddingModel: string,
  ) {}

  async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResult> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.buildChatPayload(messages, options, false)),
    });

    if (!response.ok) throw new Error(`Ollama chat request failed with status ${response.status}`);

    const raw = (await response.json()) as { message?: { content?: string; tool_calls?: ToolCall[] } };
    return { text: raw.message?.content ?? '', toolCalls: raw.message?.tool_calls, raw };
  }

  async *streamChat(messages: ChatMessage[], options: ChatOptions = {}): AsyncIterable<ChatStreamEvent> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.buildChatPayload(messages, options, true)),
    });

    if (!response.ok || !response.body) throw new Error(`Ollama chat stream failed with status ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.trim()) continue;
        const chunk = JSON.parse(line) as { message?: { content?: string; tool_calls?: ToolCall[] }; done?: boolean };
        if (chunk.message?.content) yield { type: 'delta', text: chunk.message.content };
        for (const toolCall of chunk.message?.tool_calls ?? []) yield { type: 'tool_call', toolCall };
        if (chunk.done) yield { type: 'done' };
      }

      if (done) break;
    }

    if (buffer.trim()) {
      const chunk = JSON.parse(buffer) as { message?: { content?: string; tool_calls?: ToolCall[] }; done?: boolean };
      if (chunk.message?.content) yield { type: 'delta', text: chunk.message.content };
      for (const toolCall of chunk.message?.tool_calls ?? []) yield { type: 'tool_call', toolCall };
      if (chunk.done) yield { type: 'done' };
    }
  }

  async embed(texts: string[], options: EmbeddingOptions = {}): Promise<EmbeddingResult> {
    const response = await fetch(`${this.baseUrl}/api/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: options.model ?? this.defaultEmbeddingModel, input: texts }),
    });

    if (!response.ok) throw new Error(`Ollama embedding request failed with status ${response.status}`);

    const raw = (await response.json()) as { embeddings?: number[][] };
    return { vectors: raw.embeddings ?? [], raw };
  }

  private buildChatPayload(messages: ChatMessage[], options: ChatOptions, stream: boolean) {
    return {
      model: options.model ?? this.defaultChatModel,
      messages,
      tools: options.tools,
      tool_choice: options.toolChoice,
      options: {
        temperature: options.temperature,
        stop: options.stop,
        num_predict: options.maxTokens,
      },
      stream,
    };
  }
}
