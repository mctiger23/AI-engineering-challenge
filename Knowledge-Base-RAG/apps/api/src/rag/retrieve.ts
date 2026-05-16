import type { RagDependencies, RetrievalResult, RetrieveOptions } from './types';

export class RetrievalService {
  constructor(private readonly deps: Pick<RagDependencies, 'embeddings' | 'vectorStore'>) {}

  async retrieve(query: string, options: RetrieveOptions = {}): Promise<RetrievalResult[]> {
    const embedding = await this.deps.embeddings.embed([query]);
    const vector = embedding.vectors[0];
    if (!vector) return [];

    const search = await this.deps.vectorStore.query(vector, options.topK ?? 5, options.filter);
    return search.matches.map((match) => ({
      ...match,
      sourceDocumentId: typeof match.metadata?.sourceDocumentId === 'string' ? match.metadata.sourceDocumentId : undefined,
    }));
  }
}
