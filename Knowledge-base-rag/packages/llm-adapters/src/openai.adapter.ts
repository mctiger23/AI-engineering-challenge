import {
  ChatMessage,
  ChatOptions,
  ChatResult,
  EmbeddingAdapter,
  EmbeddingOptions,
  EmbeddingResult,
  LLMChatAdapter,
} from "./interfaces";

export class OpenAIAdapter implements LLMChatAdapter, EmbeddingAdapter {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string,
    private readonly defaultChatModel: string,
    private readonly defaultEmbeddingModel: string,
  ) {}

  async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResult> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model ?? this.defaultChatModel,
        messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        stop: options.stop,
      }),
    });

    const raw = await response.json();
    return { text: raw.choices?.[0]?.message?.content ?? "", raw };
  }

  async embed(texts: string[], options: EmbeddingOptions = {}): Promise<EmbeddingResult> {
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model ?? this.defaultEmbeddingModel,
        input: texts,
        dimensions: options.dimensions,
      }),
    });

    const raw = await response.json();
    return {
      vectors: (raw.data ?? []).map((item: { embedding: number[] }) => item.embedding),
      raw,
    };
  }
}
