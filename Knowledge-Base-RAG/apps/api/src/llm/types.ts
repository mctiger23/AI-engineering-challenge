export type ChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
};

export type ToolDefinition = {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoice = 'auto' | 'none';

export type ToolCall = {
  function: {
    name: string;
    arguments?: Record<string, unknown>;
  };
};

export type ChatOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stop?: string[];
  tools?: ToolDefinition[];
  toolChoice?: ToolChoice;
};

export type ChatResult = {
  text: string;
  toolCalls?: ToolCall[];
  raw?: unknown;
};

export type ChatStreamEvent =
  | { type: 'delta'; text: string }
  | { type: 'tool_call'; toolCall: ToolCall }
  | { type: 'done' };

export interface ChatModel {
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResult>;
  streamChat(messages: ChatMessage[], options?: ChatOptions): AsyncIterable<ChatStreamEvent>;
}

export type EmbeddingOptions = {
  model?: string;
};

export type EmbeddingResult = {
  vectors: number[][];
  raw?: unknown;
};

export interface EmbeddingModel {
  embed(texts: string[], options?: EmbeddingOptions): Promise<EmbeddingResult>;
}
