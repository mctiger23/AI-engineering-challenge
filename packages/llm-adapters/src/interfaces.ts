export type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
};

export type ChatOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stop?: string[];
  metadata?: Record<string, unknown>;
};

export type ChatResult = {
  text: string;
  raw?: unknown;
};

export interface LLMChatAdapter {
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResult>;
}

export type EmbeddingOptions = {
  model?: string;
  dimensions?: number;
  metadata?: Record<string, unknown>;
};

export type EmbeddingResult = {
  vectors: number[][];
  raw?: unknown;
};

export interface EmbeddingAdapter {
  embed(texts: string[], options?: EmbeddingOptions): Promise<EmbeddingResult>;
}
