export const ragPromptTemplate = ({ question, context }: { question: string; context: string }): string =>
  ['Context:', context || 'No context was retrieved.', '', `Question: ${question}`, 'Answer:'].join('\n');
