import type { IngestOptions, IngestResult, RagDependencies, SourceDocument } from './types';

export class IngestionService {
  constructor(private readonly deps: Pick<RagDependencies, 'chunker' | 'embeddings' | 'vectorStore'>) {}

  async ingest(documents: SourceDocument[], options: IngestOptions = {}): Promise<IngestResult> {
    const chunks = documents.flatMap((document) => this.deps.chunker.chunk(document));
    if (!chunks.length) return { chunks: 0, vectorsUpserted: 0, upsertedIds: [] };

    const embeddingResult = await this.deps.embeddings.embed(chunks.map((chunk) => chunk.content));
    const vectorDocs = chunks.map((chunk, index) => ({
      id: chunk.id,
      vector: embeddingResult.vectors[index] ?? [],
      content: chunk.content,
      metadata: chunk.metadata,
    }));

    const batchSize = options.batchSize ?? 100;
    for (let index = 0; index < vectorDocs.length; index += batchSize) {
      await this.deps.vectorStore.upsert(vectorDocs.slice(index, index + batchSize));
    }

    return { chunks: chunks.length, vectorsUpserted: vectorDocs.length, upsertedIds: vectorDocs.map((document) => document.id) };
  }
}
