import type { VectorDocument, VectorFilter, VectorQueryResult, VectorStoreAdapter } from './types';

interface PgVectorClient {
  upsertDocuments(documents: VectorDocument[]): Promise<void>;
  queryDocuments(input: { vector: number[]; topK: number; filter?: VectorFilter }): Promise<Array<{ id: string; score: number; metadata?: Record<string, unknown>; content?: string }>>;
  deleteDocuments(ids: string[]): Promise<void>;
}

export class PgVectorAdapter implements VectorStoreAdapter {
  constructor(private readonly client: PgVectorClient) {}

  async upsert(documents: VectorDocument[]): Promise<void> {
    await this.client.upsertDocuments(documents);
  }

  async query(vector: number[], topK: number, filter?: VectorFilter): Promise<VectorQueryResult> {
    const matches = await this.client.queryDocuments({ vector, topK, filter });
    return { matches };
  }

  async delete(ids: string[]): Promise<void> {
    await this.client.deleteDocuments(ids);
  }
}
