import { AnswerService } from './answer';
import { IngestionService } from './ingest';
import { RetrievalService } from './retrieve';
import type {
  AnswerOptions,
  IngestOptions,
  IngestResult,
  RagCoreDependencies,
  RetrievalResult,
  RetrieveOptions,
  SourceDocument
} from './types';

export interface AskOptions {
  retrieve?: RetrieveOptions;
  answer?: AnswerOptions;
  stream?: boolean;
}

export interface AskResult {
  text?: string;
  stream?: AsyncIterable<string>;
  matches: RetrievalResult[];
}

export class RagPipeline {
  readonly ingestService: IngestionService;
  readonly retrievalService: RetrievalService;
  readonly answerService: AnswerService;

  constructor(private readonly deps: RagCoreDependencies) {
    this.ingestService = new IngestionService(deps);
    this.retrievalService = new RetrievalService(deps);
    this.answerService = new AnswerService(deps);
  }

  ingest(documents: SourceDocument[], options: IngestOptions = {}): Promise<IngestResult> {
    return this.ingestService.ingest(documents, options);
  }

  async ask(question: string, options: AskOptions = {}): Promise<AskResult> {
    const matches = await this.retrievalService.retrieve(question, options.retrieve);

    if (options.stream) {
      const messages = [
        { role: 'system' as const, content: options.answer?.systemPrompt ?? 'You are a precise, grounded assistant.' },
        {
          role: 'user' as const,
          content: (options.answer?.promptTemplate ?? (({ question: q, context }) => `Context:\n${context}\n\nQuestion: ${q}\nAnswer:`))({
            question,
            context: matches.map((m) => m.content ?? '').join('\n\n')
          })
        }
      ];

      if (this.deps.adapters?.vercelAI?.toStreamText) {
        return {
          matches,
          stream: await this.deps.adapters.vercelAI.toStreamText({ messages, options: options.answer?.chatOptions })
        };
      }

      if (this.deps.chatModel.streamChat) {
        return { matches, stream: this.deps.chatModel.streamChat(messages, options.answer?.chatOptions) };
      }
    }

    const answer = await this.answerService.answer(question, matches, options.answer);
    return { text: answer.text, matches };
  }

  asLangChainRetriever(): unknown {
    return this.deps.adapters?.langchain?.asRetriever?.((query, options) => this.retrievalService.retrieve(query, options));
  }

  asLlamaIndexRetriever(): unknown {
    return this.deps.adapters?.llamaIndex?.asRetriever?.((query, options) => this.retrievalService.retrieve(query, options));
  }

  asLlamaIndex(): unknown {
    return this.deps.adapters?.llamaIndex?.asIndex?.((documents, options) => this.ingestService.ingest(documents, options));
  }
}
