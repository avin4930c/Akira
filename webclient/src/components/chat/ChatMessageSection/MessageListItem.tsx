import React from 'react'
import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import { ChatMessage, Sender } from '@/types/chat'
import { MarkdownMessage } from './MarkdownMessage'
import { CopyButton } from '@/components/common/CopyButton'

interface MessageListItemProps {
    message: ChatMessage
}

export const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
    const isUser = message.sender === Sender.USER
    const time = new Date(message.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`group flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}
        >
            <div className={`flex w-full max-w-4xl ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
                <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${
                        isUser
                            ? 'bg-[#1a1a1a] border-border/10 text-zinc-300'
                            : 'bg-[#111111] border-accent/20 text-accent shadow-[0_0_15px_hsl(24_100%_58%/0.15)] relative overflow-hidden'
                    }`}
                >
                    {!isUser && <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />}
                    {isUser ? <User className="w-5 h-5 relative z-10" /> : <Bot className="w-5 h-5 relative z-10" />}
                </div>

                <div className={`flex flex-col space-y-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                        className={`rounded-2xl px-5 py-4 w-full shadow-sm relative overflow-hidden ${
                            isUser
                                ? 'bg-[#1a1a1a] border border-border/10 text-zinc-200 rounded-tr-md'
                                : 'bg-[#111111] border border-border/10 text-zinc-300 rounded-tl-md border-l-2 border-l-accent/50'
                        }`}
                    >
                        {!isUser && (
                            <div className="absolute top-0 right-0 p-8 opacity-50 pointer-events-none">
                                <div className="w-24 h-24 bg-accent/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
                            </div>
                        )}
                        <div className="text-[15px] leading-relaxed relative z-10 prose prose-sm dark:prose-invert prose-p:text-zinc-300 prose-headings:text-zinc-100 prose-strong:text-zinc-100 prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                            {isUser ? (
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            ) : (
                                <MarkdownMessage content={message.content} />
                            )}
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 px-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs font-mono text-zinc-500">{time}</span>
                        {!isUser && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                <CopyButton text={message.content} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}