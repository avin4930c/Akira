import React from 'react'
import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import { ChatMessage, Sender } from '@/types/chat'
import { MarkdownMessage } from './MarkdownMessage'

interface MessageListItemProps {
    message: ChatMessage
}

export const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
    const isUserMessage = message.sender === Sender.USER
    const date = new Date(message.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`flex max-w-[80%] ${isUserMessage ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
                <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isUserMessage
                            ? 'bg-primary text-primary-foreground ml-3'
                            : 'bg-gradient-accent text-accent-foreground mr-3'
                        }`}
                >
                    {isUserMessage ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                    className={`rounded-2xl px-4 py-3 ${isUserMessage
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/50 text-foreground border border-border/30'
                        }`}
                >
                    <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        {isUserMessage ? (
                            <p className="whitespace-pre-wrap">{message.content}</p>
                        ) : (
                            <MarkdownMessage content={message.content} />
                        )}
                    </div>
                    <p className="text-xs opacity-70 mt-2">
                        {date}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}