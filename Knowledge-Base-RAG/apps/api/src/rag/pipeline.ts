import { AnswerService } from './answer';
import { IngestionService } from './ingest';
import { RetrievalService } from './retrieve';
import type { AnswerOptions, IngestOptions, IngestResult, RagDependencies, RetrievalResult, RetrieveOptions, SourceDocument } from './types';

export class RagPipeline {
  readonly ingestionService: IngestionService;
  readonly retrievalService: RetrievalService;
  readonly answerService: AnswerService;

  constructor(deps: RagDependencies) {
    this.ingestionService = new IngestionService(deps);
    this.retrievalService = new RetrievalService(deps);
    this.answerService = new AnswerService(deps);
  }

  ingest(documents: SourceDocument[], options: IngestOptions = {}): Promise<IngestResult> {
    return this.ingestionService.ingest(documents, options);
  }

  search(query: string, options: RetrieveOptions = {}): Promise<RetrievalResult[]> {
    return this.retrievalService.retrieve(query, options);
  }

  async ask(question: string, options: { retrieve?: RetrieveOptions; answer?: AnswerOptions } = {}) {
    const matches = await this.search(question, options.retrieve);
    const answer = await this.answerService.answer(question, matches, options.answer);
    return { text: answer.text, matches };
  }
}
