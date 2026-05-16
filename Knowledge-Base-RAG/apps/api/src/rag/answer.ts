import { ragPromptTemplate } from './prompts/rag';
import { defaultSystemPrompt } from './prompts/system';
import type { AnswerOptions, RagDependencies, RetrievalResult } from './types';

export class AnswerService {
  constructor(private readonly deps: Pick<RagDependencies, 'chatModel'>) {}

  async answer(question: string, matches: RetrievalResult[], options: AnswerOptions = {}) {
    const context = matches.map((match, index) => `[${index + 1}] ${match.content ?? ''}`).filter(Boolean).join('\n\n');
    return this.deps.chatModel.chat(
      [
        { role: 'system', content: options.systemPrompt ?? defaultSystemPrompt },
        { role: 'user', content: ragPromptTemplate({ question, context }) },
      ],
      { tools: options.tools, toolChoice: options.toolChoice },
    );
  }
}
