import React from 'react'
import { motion } from 'framer-motion'
import { ScrollArea } from '../ui/scroll-area'
import { Bot, User } from 'lucide-react'
import { ChatMessage } from '@/types/chat';

interface ChatMessageSectionProps {
    messages: ChatMessage[];
    isTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessageSection: React.FC<ChatMessageSectionProps> = ({ messages, isTyping, messagesEndRef }) => {
    return (
        <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${message.sender === 'user'
                                ? 'bg-primary text-primary-foreground ml-3'
                                : 'bg-gradient-accent text-accent-foreground mr-3'
                                }`}>
                                {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`rounded-2xl px-4 py-3 ${message.sender === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted/50 text-foreground border border-border/30'
                                }`}>
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                <p className="text-xs opacity-70 mt-2">
                                    {new Date(message.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="flex space-x-3 max-w-[80%]">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-accent text-accent-foreground flex items-center justify-center">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="rounded-2xl px-4 py-3 bg-muted/50 border border-border/30">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </ScrollArea>
    )
}

export default ChatMessageSection