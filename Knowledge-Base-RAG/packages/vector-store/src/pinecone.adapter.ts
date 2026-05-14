import type { VectorDocument, VectorFilter, VectorQueryResult, VectorStoreAdapter } from './types';

interface PineconeIndex {
  upsert(vectors: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<void>;
  query(input: { vector: number[]; topK: number; filter?: Record<string, unknown>; includeMetadata?: boolean }): Promise<{ matches?: Array<{ id: string; score?: number; metadata?: Record<string, unknown> }> }>;
  deleteMany(ids: string[]): Promise<void>;
}

export class PineconeAdapter implements VectorStoreAdapter {
  constructor(private readonly index: PineconeIndex) {}

  async upsert(documents: VectorDocument[]): Promise<void> {
    await this.index.upsert(
      documents.map((document) => ({
        id: document.id,
        values: document.vector,
        metadata: { ...document.metadata, content: document.content }
      }))
    );
  }

  async query(vector: number[], topK: number, filter?: VectorFilter): Promise<VectorQueryResult> {
    const response = await this.index.query({ vector, topK, filter: filter as Record<string, unknown> | undefined, includeMetadata: true });

    return {
      matches: (response.matches ?? []).map((match) => ({
        id: match.id,
        score: match.score ?? 0,
        metadata: match.metadata as Record<string, never> | undefined,
        content: typeof match.metadata?.content === 'string' ? match.metadata.content : undefined
      }))
    };
  }

  async delete(ids: string[]): Promise<void> {
    await this.index.deleteMany(ids);
  }
}
