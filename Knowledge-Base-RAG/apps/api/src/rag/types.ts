import type { ChatModel, EmbeddingModel, ToolChoice, ToolDefinition } from '../llm/types';
import type { VectorFilter, VectorMetadata, VectorQueryMatch, VectorStoreAdapter } from '../vector-store/types';

export type Chunk = {
  id: string;
  content: string;
  metadata?: VectorMetadata;
};

export type SourceDocument = {
  id: string;
  content: string;
  metadata?: VectorMetadata;
};

export interface Chunker {
  chunk(document: SourceDocument): Chunk[];
}

export type RetrievalResult = VectorQueryMatch & {
  sourceDocumentId?: string;
};

export type IngestOptions = {
  batchSize?: number;
};

export type IngestResult = {
  chunks: number;
  vectorsUpserted: number;
  upsertedIds: string[];
};

export type RetrieveOptions = {
  topK?: number;
  filter?: VectorFilter;
};

export type AnswerOptions = {
  systemPrompt?: string;
  tools?: ToolDefinition[];
  toolChoice?: ToolChoice;
};

export type RagDependencies = {
  vectorStore: VectorStoreAdapter;
  embeddings: EmbeddingModel;
  chatModel: ChatModel;
  chunker: Chunker;
};
