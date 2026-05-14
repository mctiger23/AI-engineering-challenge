export type VectorMetadataValue = string | number | boolean;
export type VectorMetadata = Record<string, VectorMetadataValue | VectorMetadataValue[] | null>;
export type VectorFilterValue =
  | VectorMetadataValue
  | VectorMetadataValue[]
  | { eq?: VectorMetadataValue; in?: VectorMetadataValue[]; gt?: number; gte?: number; lt?: number; lte?: number };
export type VectorFilter = Record<string, VectorFilterValue>;

export interface VectorDocument {
  id: string;
  vector: number[];
  metadata?: VectorMetadata;
  content?: string;
}

export interface VectorQueryMatch {
  id: string;
  score: number;
  metadata?: VectorMetadata;
  content?: string;
}

export interface VectorQueryResult {
  matches: VectorQueryMatch[];
}

export interface VectorStoreAdapter {
  upsert(documents: VectorDocument[]): Promise<void>;
  query(vector: number[], topK: number, filter?: VectorFilter): Promise<VectorQueryResult>;
  delete(ids: string[]): Promise<void>;
}

export type Role = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface ChatResult {
  text: string;
  raw?: unknown;
}

export interface ChatModel {
  chat(messages: ChatMessage[], options?: Record<string, unknown>): Promise<ChatResult>;
}

export interface StreamingChatModel {
  streamChat?(messages: ChatMessage[], options?: Record<string, unknown>): AsyncIterable<string>;
}

export interface EmbeddingModel {
  embed(texts: string[], options?: Record<string, unknown>): Promise<{ vectors: number[][]; raw?: unknown }>;
}

export interface Chunk {
  id: string;
  content: string;
  metadata?: VectorMetadata;
}

export interface SourceDocument {
  id: string;
  content: string;
  metadata?: VectorMetadata;
}

export interface Chunker {
  chunk(document: SourceDocument): Chunk[];
}

export interface RetrievalResult extends VectorQueryMatch {
  sourceDocumentId?: string;
}

export interface Reranker {
  rerank?(query: string, matches: RetrievalResult[]): Promise<RetrievalResult[]>;
}

export interface FrameworkAdapters {
  vercelAI?: {
    toStreamText?: (payload: { messages: ChatMessage[]; options?: Record<string, unknown> }) => Promise<AsyncIterable<string>>;
  };
  langchain?: {
    asRetriever?: (retrieve: (query: string, options?: RetrieveOptions) => Promise<RetrievalResult[]>) => unknown;
  };
  llamaIndex?: {
    asRetriever?: (retrieve: (query: string, options?: RetrieveOptions) => Promise<RetrievalResult[]>) => unknown;
    asIndex?: (ingest: (documents: SourceDocument[], options?: IngestOptions) => Promise<IngestResult>) => unknown;
  };
}

export interface IngestOptions {
  namespace?: string;
  batchSize?: number;
  embeddingOptions?: Record<string, unknown>;
}

export interface IngestResult {
  chunks: number;
  vectorsUpserted: number;
}

export interface RetrieveOptions {
  topK?: number;
  filter?: VectorFilter;
  embeddingOptions?: Record<string, unknown>;
}

export interface AnswerOptions {
  chatOptions?: Record<string, unknown>;
  systemPrompt?: string;
  promptTemplate?: (params: { question: string; context: string }) => string;
}

export interface RagCoreDependencies {
  vectorStore: VectorStoreAdapter;
  embeddings: EmbeddingModel;
  chatModel: ChatModel & Partial<StreamingChatModel>;
  chunker: Chunker;
  reranker?: Reranker;
  adapters?: FrameworkAdapters;
}
