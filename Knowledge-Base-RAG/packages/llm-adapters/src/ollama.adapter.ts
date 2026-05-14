import {
  ChatMessage,
  ChatOptions,
  ChatResult,
  EmbeddingAdapter,
  EmbeddingOptions,
  EmbeddingResult,
  LLMChatAdapter,
} from "./interfaces";

export class OllamaAdapter implements LLMChatAdapter, EmbeddingAdapter {
  constructor(
    private readonly baseUrl: string,
    private readonly defaultChatModel: string,
    private readonly defaultEmbeddingModel: string,
  ) {}

  async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResult> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: options.model ?? this.defaultChatModel,
        messages,
        options: {
          temperature: options.temperature,
          stop: options.stop,
          num_predict: options.maxTokens,
        },
        stream: false,
      }),
    });

    const raw = await response.json();
    return { text: raw.message?.content ?? "", raw };
  }

  async embed(texts: string[], options: EmbeddingOptions = {}): Promise<EmbeddingResult> {
    const response = await fetch(`${this.baseUrl}/api/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: options.model ?? this.defaultEmbeddingModel,
        input: texts,
      }),
    });

    const raw = await response.json();
    return { vectors: raw.embeddings ?? [], raw };
  }
}
