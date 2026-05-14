export interface RagPromptInput {
  question: string;
  context: string;
}

export const ragPromptTemplate = ({ question, context }: RagPromptInput): string => {
  return [`Context:`, context || 'No context was retrieved.', '', `Question: ${question}`, 'Answer:'].join('\n');
};
