import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'

interface ChatInputProps {
    inputValue: string;
    setInputValue: (value: string) => void;
    handleSendMessage: () => void;
    isTyping: boolean;
    placeholder?: string;
    disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
    inputValue,
    setInputValue,
    handleSendMessage,
    isTyping,
    placeholder = "Ask me anything about motorcycles...",
    disabled = false,
}) => {
    return (
        <div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
                <div className="flex space-x-3 items-end">
                    <div className="flex-1 relative">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={placeholder}
                            className="pr-12 py-3 text-sm resize-none bg-muted/30 border-border/50 focus:border-accent/50 rounded-xl"
                            disabled={isTyping || disabled}
                        />
                    </div>
                    <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping || disabled}
                        variant="hero"
                        size="icon"
                        className="w-11 h-11"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    Akira can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    )
}

export default ChatInput