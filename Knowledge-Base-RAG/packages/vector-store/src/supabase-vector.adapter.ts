import type { VectorDocument, VectorFilter, VectorQueryResult, VectorStoreAdapter } from './types';

interface SupabaseVectorClient {
  upsert(input: { id: string; embedding: number[]; metadata: Record<string, unknown>; content: string | null }[]): Promise<void>;
  match(input: { query_embedding: number[]; match_count: number; filter?: Record<string, unknown> }): Promise<Array<{ id: string; score: number; metadata?: Record<string, unknown>; content?: string }>>;
  delete(ids: string[]): Promise<void>;
}

export class SupabaseVectorAdapter implements VectorStoreAdapter {
  constructor(private readonly client: SupabaseVectorClient) {}

  async upsert(documents: VectorDocument[]): Promise<void> {
    await this.client.upsert(
      documents.map((document) => ({
        id: document.id,
        embedding: document.vector,
        metadata: document.metadata ?? {},
        content: document.content ?? null
      }))
    );
  }

  async query(vector: number[], topK: number, filter?: VectorFilter): Promise<VectorQueryResult> {
    const matches = await this.client.match({
      query_embedding: vector,
      match_count: topK,
      filter: filter as Record<string, unknown> | undefined
    });

    return { matches };
  }

  async delete(ids: string[]): Promise<void> {
    await this.client.delete(ids);
  }
}
