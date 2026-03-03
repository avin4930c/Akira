import React, { useState, useEffect, useCallback } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { ChatMessage, StreamingMessage } from '@/types/chat'
import { MessageListItem } from './ChatMessageSection/MessageListItem'
import { StreamingMessageBubble } from './ChatMessageSection/StreamingMessageBubble'
import { TypingStateBubble } from './ChatMessageSection/TypingStateBubble'
import { EmptyState } from './ChatMessageSection/EmptyState'
import { useChatAutoScroll } from './ChatMessageSection/useChatAutoScroll'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

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
  const [showFab, setShowFab] = useState(false)

  const handleScrollChange = useCallback((isNearBottom: boolean) => {
    setShowFab(!isNearBottom)
  }, [])

  const { scrollAreaRef, scrollToBottom } = useChatAutoScroll(
    messages.length, 
    streamingMessage,
    handleScrollChange
  )

  return (
    <div className="relative h-full bg-[#0a0a0a]">
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <div className="space-y-6 max-w-4xl mx-auto p-6 md:p-8">
          {messages.length === 0 && !streamingMessage && !isWaitingForResponse && <EmptyState />}

          {messages.map((message) => (
            <MessageListItem key={`message-${message.id}`} message={message} />
          ))}

          {streamingMessage && <StreamingMessageBubble message={streamingMessage} />}

          {isWaitingForResponse && !streamingMessage && <TypingStateBubble />}
          <div className="h-4" /> {/* Bottom padding */}
        </div>
      </ScrollArea>

      {/* Scroll to bottom FAB */}
      <AnimatePresence>
        {showFab && messages.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => scrollToBottom('smooth')}
            className="absolute bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-[#111111] border border-accent/20 shadow-[0_0_15px_hsl(24_100%_58%/0.2)] flex items-center justify-center hover:bg-[#1a1a1a] hover:scale-105 transition-all duration-300"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-5 h-5 text-accent" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatMessageSection