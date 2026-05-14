import type { IngestOptions, IngestResult, RagCoreDependencies, SourceDocument, VectorDocument } from './types';

export class IngestionService {
  constructor(private readonly deps: Pick<RagCoreDependencies, 'chunker' | 'embeddings' | 'vectorStore'>) {}

  async ingest(documents: SourceDocument[], options: IngestOptions = {}): Promise<IngestResult> {
    const chunks = documents.flatMap((doc) => this.deps.chunker.chunk(doc));
    if (!chunks.length) return { chunks: 0, vectorsUpserted: 0 };

    const embeddingResult = await this.deps.embeddings.embed(
      chunks.map((chunk) => chunk.content),
      options.embeddingOptions
    );

    const vectorDocs: VectorDocument[] = chunks.map((chunk, index) => ({
      id: chunk.id,
      vector: embeddingResult.vectors[index] ?? [],
      content: chunk.content,
      metadata: {
        ...chunk.metadata,
        namespace: options.namespace ?? null
      }
    }));

    const batchSize = options.batchSize ?? 100;
    for (let i = 0; i < vectorDocs.length; i += batchSize) {
      await this.deps.vectorStore.upsert(vectorDocs.slice(i, i + batchSize));
    }

    return { chunks: chunks.length, vectorsUpserted: vectorDocs.length };
  }
}
