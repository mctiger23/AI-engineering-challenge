import type { VectorDocument, VectorFilter, VectorQueryResult, VectorStoreAdapter } from './types';

interface ChromaClient {
  upsert(input: { ids: string[]; embeddings: number[][]; metadatas?: Record<string, unknown>[]; documents?: string[] }): Promise<void>;
  query(input: { queryEmbeddings: number[][]; nResults: number; where?: Record<string, unknown> }): Promise<{ ids: string[][]; distances?: number[][]; metadatas?: Record<string, unknown>[][]; documents?: string[][] }>;
  delete(input: { ids: string[] }): Promise<void>;
}

export class ChromaAdapter implements VectorStoreAdapter {
  constructor(private readonly client: ChromaClient) {}

  async upsert(documents: VectorDocument[]): Promise<void> {
    await this.client.upsert({
      ids: documents.map((document) => document.id),
      embeddings: documents.map((document) => document.vector),
      metadatas: documents.map((document) => document.metadata ?? {}),
      documents: documents.map((document) => document.content ?? '')
    });
  }

  async query(vector: number[], topK: number, filter?: VectorFilter): Promise<VectorQueryResult> {
    const response = await this.client.query({
      queryEmbeddings: [vector],
      nResults: topK,
      where: filter as Record<string, unknown> | undefined
    });

    const ids = response.ids[0] ?? [];
    const distances = response.distances?.[0] ?? [];
    const metadatas = response.metadatas?.[0] ?? [];
    const documents = response.documents?.[0] ?? [];

    return {
      matches: ids.map((id, index) => ({
        id,
        score: 1 - (distances[index] ?? 1),
        metadata: metadatas[index] as Record<string, never> | undefined,
        content: documents[index]
      }))
    };
  }

  async delete(ids: string[]): Promise<void> {
    await this.client.delete({ ids });
  }
}
