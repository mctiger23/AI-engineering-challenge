import type { ChatMessage } from '../../lib/api-client';

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 500, overflowY: 'auto', padding: 12, background: '#fff', borderRadius: 8 }}>
      {messages.map((message) => (
        <div
          key={message.id}
          style={{
            alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            padding: '10px 12px',
            borderRadius: 8,
            background: message.role === 'user' ? '#dbeafe' : '#eef2ff'
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>{message.role}</div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        </div>
      ))}
    </div>
  );
}
