import React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { ChatMessage, StreamingMessage } from '@/types/chat'
import { MessageListItem } from './ChatMessageSection/MessageListItem'
import { StreamingMessageBubble } from './ChatMessageSection/StreamingMessageBubble'
import { TypingStateBubble } from './ChatMessageSection/TypingStateBubble'
import { EmptyState } from './ChatMessageSection/EmptyState'
import { useChatAutoScroll } from './ChatMessageSection/useChatAutoScroll'

interface ChatMessageSectionProps {
  messages: ChatMessage[];
  streamingMessage?: StreamingMessage | null;
  isWaitingForResponse?: boolean;
}

const ChatMessageSection: React.FC<ChatMessageSectionProps> = ({
  messages,
  streamingMessage,
  isWaitingForResponse = false,
}) => {
  const { scrollAreaRef } = useChatAutoScroll(messages.length, streamingMessage)

  return (
    <ScrollArea className="h-full" ref={scrollAreaRef}>
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        {messages.length === 0 && !streamingMessage && !isWaitingForResponse && <EmptyState />}

        {messages.map((message) => (
          <MessageListItem key={`message-${message.id}`} message={message} />
        ))}

        {streamingMessage && <StreamingMessageBubble message={streamingMessage} />}

        {isWaitingForResponse && !streamingMessage && <TypingStateBubble />}
      </div>
    </ScrollArea>
  )
}

export default ChatMessageSection