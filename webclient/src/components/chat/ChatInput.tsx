import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { ArrowUp } from 'lucide-react'

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isTyping: boolean;
    placeholder?: string;
    disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
    onSendMessage,
    isTyping,
    placeholder = "Ask me anything about motorcycles...",
    disabled = false,
}) => {
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize
    useEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
        }
    }, [inputValue]);

    const handleSend = useCallback(() => {
        const trimmedMessage = inputValue.trim();
        if (trimmedMessage && !isTyping && !disabled) {
            onSendMessage(trimmedMessage);
            setInputValue('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    }, [inputValue, isTyping, disabled, onSendMessage]);

    return (
        <div className="p-4 bg-[#0a0a0a]/80 backdrop-blur-md relative z-10 before:absolute before:inset-x-0 before:-top-24 before:h-24 before:bg-gradient-to-t before:from-[#0a0a0a]/80 before:to-transparent before:pointer-events-none border-t border-accent/10">
            <div className="max-w-4xl mx-auto space-y-3">
                <div className="relative rounded-2xl border border-accent/20 bg-[#111111] shadow-xl focus-within:border-accent/40 focus-within:shadow-[0_0_30px_hsl(24_100%_58%/0.25)] transition-all duration-500 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <div className="w-32 h-32 bg-accent/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
                    </div>
                    <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={placeholder}
                        rows={1}
                        disabled={disabled}
                        className="w-full resize-none bg-transparent px-6 py-4 pr-16 text-[15px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:opacity-50 relative z-10"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isTyping || disabled}
                        size="icon"
                        className="absolute bottom-2.5 right-3 w-9 h-9 rounded-xl bg-accent hover:bg-accent/90 text-white shadow-lg disabled:opacity-50 disabled:bg-[#1a1a1a] disabled:text-zinc-500 z-10 transition-colors"
                    >
                        <ArrowUp className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-2">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#1a1a1a] border border-border/10">Enter</kbd> to send
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border/20" />
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#1a1a1a] border border-border/10">Shift+Enter</kbd> new line
                        </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium tracking-wide">
                        Akira can make mistakes. Verify important info.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ChatInput