import type { ChatMessage } from '../../lib/api-client';
import { ScrollArea } from '../ui/scroll-area';

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-border bg-surface p-8">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-5 h-px w-12 bg-accent" />
          <h3 className="text-base font-medium">Ask the knowledge base</h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Responses stream here, with source evidence displayed alongside each answer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface">
      <ScrollArea className="h-[420px]">
        <div className="flex flex-col gap-5 p-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <span className="mb-1.5 px-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                {message.role === 'user' ? 'you' : 'assistant'}
              </span>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-accent text-background'
                    : 'border border-border bg-background'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
