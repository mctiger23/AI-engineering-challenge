import type { VectorDocument, VectorFilter, VectorQueryResult, VectorStoreAdapter } from './types';

interface QdrantClient {
  upsert(input: { points: Array<{ id: string; vector: number[]; payload?: Record<string, unknown> }> }): Promise<void>;
  search(input: { vector: number[]; limit: number; filter?: Record<string, unknown>; with_payload?: boolean }): Promise<Array<{ id: string | number; score: number; payload?: Record<string, unknown> }>>;
  delete(input: { points: string[] }): Promise<void>;
}

export class QdrantAdapter implements VectorStoreAdapter {
  constructor(private readonly client: QdrantClient) {}

  async upsert(documents: VectorDocument[]): Promise<void> {
    await this.client.upsert({
      points: documents.map((document) => ({
        id: document.id,
        vector: document.vector,
        payload: { ...document.metadata, content: document.content }
      }))
    });
  }

  async query(vector: number[], topK: number, filter?: VectorFilter): Promise<VectorQueryResult> {
    const matches = await this.client.search({
      vector,
      limit: topK,
      filter: filter as Record<string, unknown> | undefined,
      with_payload: true
    });

    return {
      matches: matches.map((match) => ({
        id: String(match.id),
        score: match.score,
        metadata: match.payload as Record<string, never> | undefined,
        content: typeof match.payload?.content === 'string' ? match.payload.content : undefined
      }))
    };
  }

  async delete(ids: string[]): Promise<void> {
    await this.client.delete({ points: ids });
  }
}
