import type { ChatMessage } from '../../lib/api-client';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <Card className="flex min-h-[420px] items-center justify-center p-8">
        <div className="max-w-md text-center">
          <Badge className="mb-4">Ready</Badge>
          <h3 className="text-xl">Ask the knowledge base</h3>
          <p className="mt-2 text-sm text-muted">
            Responses will stream here, with the source evidence held beside the conversation.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <ScrollArea className="h-[420px] pr-3">
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[85%] rounded-xl border p-4 ${
                message.role === 'user'
                  ? 'self-end border-accent/40 bg-accent text-background'
                  : 'self-start border-border bg-background'
              }`}
            >
              <Badge className={message.role === 'user' ? 'mb-3 border-background/30 text-background' : 'mb-3'}>
                {message.role}
              </Badge>
              <div className="whitespace-pre-wrap text-sm">{message.content}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
