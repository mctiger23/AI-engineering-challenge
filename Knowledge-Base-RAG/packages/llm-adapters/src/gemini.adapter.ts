import {
  ChatMessage,
  ChatOptions,
  ChatResult,
  EmbeddingAdapter,
  EmbeddingOptions,
  EmbeddingResult,
  LLMChatAdapter,
} from "./interfaces";

export class GeminiAdapter implements LLMChatAdapter, EmbeddingAdapter {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string,
    private readonly defaultChatModel: string,
    private readonly defaultEmbeddingModel: string,
  ) {}

  async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResult> {
    const model = options.model ?? this.defaultChatModel;
    const response = await fetch(`${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          temperature: options.temperature,
          maxOutputTokens: options.maxTokens,
          stopSequences: options.stop,
        },
      }),
    });

    const raw = await response.json();
    return { text: raw.candidates?.[0]?.content?.parts?.[0]?.text ?? "", raw };
  }

  async embed(texts: string[], options: EmbeddingOptions = {}): Promise<EmbeddingResult> {
    const model = options.model ?? this.defaultEmbeddingModel;
    const vectors: number[][] = [];

    for (const text of texts) {
      const response = await fetch(`${this.baseUrl}/models/${model}:embedContent?key=${this.apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: { parts: [{ text }] } }),
      });
      const raw = await response.json();
      vectors.push(raw.embedding?.values ?? []);
    }

    return { vectors };
  }
}
