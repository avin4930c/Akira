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
    const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })
    const contentKey = `${message.id}-${message.content.length}`

    return (
        <motion.div
            key={`streaming-${message.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group flex justify-start w-full"
        >
            <div className="flex gap-4 w-full max-w-4xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm bg-[#111111] border-accent/20 text-accent shadow-[0_0_15px_hsl(24_100%_58%/0.15)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
                    <Bot className="w-5 h-5 relative z-10 animate-pulse" />
                </div>

                <div className="flex flex-col space-y-2 max-w-[85%] items-start">
                    <div className="rounded-2xl rounded-tl-md px-5 py-4 w-full bg-[#111111] border border-border/10 border-l-2 border-l-accent/50 text-zinc-300 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-8 opacity-50 pointer-events-none">
                            <div className="w-24 h-24 bg-accent/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
                        </div>
                        <motion.div
                            key={contentKey}
                            initial={{ opacity: 0.9, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.6 }}
                            className="text-[15px] leading-relaxed relative z-10"
                        >
                            <div className="flex flex-wrap items-end gap-2">
                                <div className="prose prose-sm dark:prose-invert prose-p:text-zinc-300 prose-headings:text-zinc-100 prose-strong:text-zinc-100 prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                    <MarkdownMessage content={message.content} />
                                </div>
                                {message.partial && (
                                    <div className="inline-flex items-center gap-1 pb-0.5 text-accent/80 ml-1">
                                        <TypingIndicator />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                    <span className="text-xs font-mono text-zinc-500 px-2">{time}</span>
                </div>
            </div>
        </motion.div>
    )
}