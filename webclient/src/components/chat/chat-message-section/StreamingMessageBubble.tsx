import React from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { StreamingMessage } from '@/types/chat'
import { MarkdownMessage } from './MarkdownMessage'
import TypingIndicator from '../TypingIndicator'

interface StreamingMessageBubbleProps {
    message: StreamingMessage
}

export const StreamingMessageBubble: React.FC<StreamingMessageBubbleProps> = ({ message }) => {
    const date = new Date(message.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })
    const contentKey = `${message.id}-${message.content.length}`

    return (
        <motion.div
            key={`streaming-${message.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
        >
            <div className="flex space-x-3 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-accent text-accent-foreground flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-muted/50 text-foreground border border-border/30 overflow-hidden">
                    <motion.div
                        key={contentKey}
                        initial={{ opacity: 0.9, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.6 }}
                        className="text-sm leading-relaxed"
                    >
                        <div className="flex flex-wrap items-end gap-2">
                            <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                <MarkdownMessage content={message.content} />
                            </div>
                            {message.partial && (
                                <div className="inline-flex items-center gap-1 pb-0.5 text-muted-foreground/80">
                                    <TypingIndicator />
                                </div>
                            )}
                        </div>
                    </motion.div>
                    <p className="text-xs opacity-70 mt-2">
                        {date}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}