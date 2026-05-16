import { ChromaClient, type Collection, type Metadata, type Where } from 'chromadb';
import type { VectorDocument, VectorFilter, VectorQueryResult, VectorStoreAdapter } from './types';

export class ChromaAdapter implements VectorStoreAdapter {
  private collectionPromise?: Promise<Collection>;

  constructor(
    private readonly client: ChromaClient,
    private readonly collectionName: string,
  ) {}

  async upsert(documents: VectorDocument[]): Promise<void> {
    if (!documents.length) return;
    const collection = await this.getCollection();
    await collection.upsert({
      ids: documents.map((document) => document.id),
      embeddings: documents.map((document) => document.vector),
      metadatas: documents.map((document) => (document.metadata ?? {}) as Metadata),
      documents: documents.map((document) => document.content ?? ''),
    });
  }

  async query(vector: number[], topK: number, filter?: VectorFilter): Promise<VectorQueryResult> {
    const collection = await this.getCollection();
    const response = await collection.query({
      queryEmbeddings: [vector],
      nResults: topK,
      where: this.toChromaFilter(filter),
    });

    const ids = response.ids[0] ?? [];
    const distances = response.distances?.[0] ?? [];
    const metadatas = response.metadatas?.[0] ?? [];
    const documents = response.documents?.[0] ?? [];

    return {
      matches: ids.map((id, index) => ({
        id,
        score: 1 - (distances[index] ?? 1),
        metadata: (metadatas[index] ?? undefined) as VectorDocument['metadata'],
        content: documents[index] ?? undefined,
      })),
    };
  }

  async delete(ids: string[]): Promise<void> {
    if (!ids.length) return;
    const collection = await this.getCollection();
    await collection.delete({ ids });
  }

  async count(): Promise<number> {
    const collection = await this.getCollection();
    return collection.count();
  }

  private getCollection(): Promise<Collection> {
    this.collectionPromise ??= this.client.getOrCreateCollection({ name: this.collectionName, embeddingFunction: null });
    return this.collectionPromise;
  }

  private toChromaFilter(filter?: VectorFilter): Where | undefined {
    if (!filter || Object.keys(filter).length === 0) return undefined;

    const conditions = Object.entries(filter).map(([key, value]) => {
      if (Array.isArray(value)) return { [key]: { $in: value } };
      if (value && typeof value === 'object') {
        const clauses = Object.entries(value).map(([operator, operand]) => ({
          [key]: { [`$${operator}`]: operand },
        }));
        return clauses.length === 1 ? clauses[0] : { $and: clauses };
      }
      return { [key]: value };
    });

    return (conditions.length === 1 ? conditions[0] : { $and: conditions }) as Where;
  }
}
