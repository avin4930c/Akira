import ChatHeader from '@/components/chat/ChatHeader'
import ChatInput from '@/components/chat/ChatInput'
import ChatMessageSection from '@/components/chat/ChatMessageSection'
import { ChatMessage, StreamingMessage } from '@/types/chat'
import React from 'react'

interface ChatInterfaceProps {
    messages: ChatMessage[];
    streamingMessage?: StreamingMessage | null;
    isConnected: boolean;
    isLoading: boolean;
    isWaitingForResponse?: boolean;
    error?: string | null;
    onSendMessage: (message: string) => void;
    onRetry?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
    messages, 
    streamingMessage,
    isConnected,
    isLoading,
    isWaitingForResponse = false,
    error,
    onSendMessage,
    onRetry
}) => {
    const isTyping = !!streamingMessage || isLoading || isWaitingForResponse;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 border-b border-border/20">
                <ChatHeader 
                    isConnected={isConnected}
                    error={error}
                    onRetry={onRetry}
                />
            </div>
            
            <div className="flex-1 min-h-0">
                <ChatMessageSection 
                    messages={messages} 
                    streamingMessage={streamingMessage}
                    isWaitingForResponse={isTyping}
                />
            </div>
            
            <div className="flex-shrink-0 border-t border-border/20">
                <ChatInput 
                    onSendMessage={onSendMessage} 
                    isTyping={isTyping}
                    disabled={!isConnected}
                    placeholder={
                        !isConnected 
                            ? "Reconnecting to chat server..." 
                            : isTyping 
                            ? "AI is responding..." 
                            : "Ask me anything about motorcycles..."
                    }
                />
            </div>
        </div>
    )
}

export default ChatInterface