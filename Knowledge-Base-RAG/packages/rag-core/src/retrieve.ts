import type { RagCoreDependencies, RetrievalResult, RetrieveOptions } from './types';

export class RetrievalService {
  constructor(private readonly deps: Pick<RagCoreDependencies, 'embeddings' | 'vectorStore' | 'reranker'>) {}

  async retrieve(query: string, options: RetrieveOptions = {}): Promise<RetrievalResult[]> {
    const embedding = await this.deps.embeddings.embed([query], options.embeddingOptions);
    const [vector] = embedding.vectors;
    if (!vector) return [];

    const search = await this.deps.vectorStore.query(vector, options.topK ?? 5, options.filter);
    let matches: RetrievalResult[] = search.matches.map((match) => ({
      ...match,
      sourceDocumentId:
        typeof match.metadata?.sourceDocumentId === 'string' ? match.metadata.sourceDocumentId : undefined
    }));

    if (this.deps.reranker?.rerank) {
      matches = await this.deps.reranker.rerank(query, matches);
    }

    return matches;
  }
}
