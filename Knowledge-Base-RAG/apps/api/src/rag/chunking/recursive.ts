import type { Chunk, Chunker, SourceDocument } from '../types';

export interface RecursiveChunkerOptions {
  chunkSize?: number;
  chunkOverlap?: number;
  separators?: string[];
}

const DEFAULT_SEPARATORS = ['\n\n', '\n', '. ', ' '];

export class RecursiveChunker implements Chunker {
  private readonly chunkSize: number;
  private readonly chunkOverlap: number;
  private readonly separators: string[];

  constructor(options: RecursiveChunkerOptions = {}) {
    this.chunkSize = options.chunkSize ?? 800;
    this.chunkOverlap = options.chunkOverlap ?? 120;
    this.separators = options.separators ?? DEFAULT_SEPARATORS;
  }

  chunk(document: SourceDocument): Chunk[] {
    const parts = this.splitRecursive(document.content, this.separators);
    const chunks: Chunk[] = [];
    let buffer = '';

    for (const part of parts) {
      const candidate = buffer ? `${buffer}${part}` : part;
      if (candidate.length <= this.chunkSize) {
        buffer = candidate;
        continue;
      }

      if (buffer) chunks.push(this.createChunk(document, chunks.length, buffer));
      buffer = part.length > this.chunkSize ? this.forceSplit(part, document, chunks) : part;
    }

    if (buffer.trim()) chunks.push(this.createChunk(document, chunks.length, buffer));
    return chunks;
  }

  private splitRecursive(text: string, separators: string[]): string[] {
    const [head, ...tail] = separators;
    if (!head) return [text];

    const parts = text.split(head);
    if (parts.length === 1) return this.splitRecursive(text, tail);

    return parts.flatMap((part, index) => {
      const suffix = index < parts.length - 1 ? head : '';
      return this.splitRecursive(`${part}${suffix}`, tail);
    });
  }

  private forceSplit(part: string, document: SourceDocument, chunks: Chunk[]): string {
    let cursor = 0;
    while (cursor + this.chunkSize < part.length) {
      const slice = part.slice(cursor, cursor + this.chunkSize);
      chunks.push(this.createChunk(document, chunks.length, slice));
      cursor += Math.max(1, this.chunkSize - this.chunkOverlap);
    }

    return part.slice(cursor);
  }

  private createChunk(document: SourceDocument, index: number, content: string): Chunk {
    return {
      id: `${document.id}:chunk:${index}`,
      content: content.trim(),
      metadata: { ...document.metadata, sourceDocumentId: document.id, chunkIndex: index },
    };
  }
}
