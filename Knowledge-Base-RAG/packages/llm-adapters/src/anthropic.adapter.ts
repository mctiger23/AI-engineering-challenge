import {
  ChatMessage,
  ChatOptions,
  ChatResult,
  EmbeddingAdapter,
  EmbeddingOptions,
  EmbeddingResult,
  LLMChatAdapter,
} from "./interfaces";

export class AnthropicAdapter implements LLMChatAdapter, EmbeddingAdapter {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string,
    private readonly defaultModel: string,
  ) {}

  async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResult> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: options.model ?? this.defaultModel,
        max_tokens: options.maxTokens ?? 1024,
        temperature: options.temperature,
        messages: messages
          .filter((message) => message.role === "user" || message.role === "assistant")
          .map((message) => ({ role: message.role, content: message.content })),
        system: messages.filter((message) => message.role === "system").map((message) => message.content).join("\n"),
      }),
    });

    const raw = await response.json();
    return { text: raw.content?.[0]?.text ?? "", raw };
  }

  async embed(_texts: string[], _options: EmbeddingOptions = {}): Promise<EmbeddingResult> {
    throw new Error("Anthropic does not provide a native embeddings endpoint in this adapter.");
  }
}
