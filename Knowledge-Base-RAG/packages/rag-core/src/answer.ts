import { ragPromptTemplate } from './prompts/rag';
import { defaultSystemPrompt } from './prompts/system';
import type { AnswerOptions, ChatResult, RagCoreDependencies, RetrievalResult } from './types';

const buildContext = (matches: RetrievalResult[]): string =>
  matches
    .map((match, idx) => `[${idx + 1}] ${match.content ?? ''}`)
    .filter(Boolean)
    .join('\n\n');

export class AnswerService {
  constructor(private readonly deps: Pick<RagCoreDependencies, 'chatModel'>) {}

  async answer(question: string, matches: RetrievalResult[], options: AnswerOptions = {}): Promise<ChatResult> {
    const context = buildContext(matches);
    const template = options.promptTemplate ?? ragPromptTemplate;
    const userPrompt = template({ question, context });

    return this.deps.chatModel.chat(
      [
        { role: 'system', content: options.systemPrompt ?? defaultSystemPrompt },
        { role: 'user', content: userPrompt }
      ],
      options.chatOptions
    );
  }
}
