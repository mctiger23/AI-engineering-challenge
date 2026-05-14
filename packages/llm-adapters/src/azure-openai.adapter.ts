import {
  ChatMessage,
  ChatOptions,
  ChatResult,
  EmbeddingAdapter,
  EmbeddingOptions,
  EmbeddingResult,
  LLMChatAdapter,
} from "./interfaces";

export class AzureOpenAIAdapter implements LLMChatAdapter, EmbeddingAdapter {
  constructor(
    private readonly apiKey: string,
    private readonly resourceUrl: string,
    private readonly apiVersion: string,
    private readonly chatDeployment: string,
    private readonly embeddingDeployment: string,
  ) {}

  async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResult> {
    const deployment = options.model ?? this.chatDeployment;
    const url = `${this.resourceUrl}/openai/deployments/${deployment}/chat/completions?api-version=${this.apiVersion}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
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
    const deployment = options.model ?? this.embeddingDeployment;
    const url = `${this.resourceUrl}/openai/deployments/${deployment}/embeddings?api-version=${this.apiVersion}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
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
