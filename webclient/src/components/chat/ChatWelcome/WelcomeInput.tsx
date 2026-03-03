import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

interface WelcomeInputProps {
  onStartChat: (message: string) => void;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  isCreating?: boolean;
}

export default function WelcomeInput({
  onStartChat,
  placeholder = "Ask me anything about motorcycles...",
  value: externalValue,
  onChange: externalOnChange,
  isCreating = false
}: WelcomeInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const inputValue = externalValue !== undefined ? externalValue : internalValue;
  const handleChange = externalOnChange || setInternalValue;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  }, [inputValue]);

  const handleSubmit = () => {
    if (!inputValue.trim() || isCreating) return;
    onStartChat(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="relative rounded-2xl border border-border/10 bg-[#111111] shadow-xl focus-within:border-accent/30 focus-within:shadow-[0_0_30px_hsl(24_100%_58%/0.15)] transition-all duration-500 overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="w-32 h-32 bg-accent/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
        </div>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none bg-transparent px-6 py-5 pr-16 text-[15px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none relative z-10"
          onKeyDown={handleKeyDown}
        />
        <Button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isCreating}
          size="icon"
          className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-xl bg-accent hover:bg-accent/90 text-white shadow-lg disabled:opacity-50 disabled:bg-[#1a1a1a] disabled:text-zinc-500 z-10 transition-colors"
        >
          {isCreating ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowUp className="w-5 h-5" />
          )}
        </Button>
      </div>
      <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 text-[10px] font-mono rounded-md border border-border/10 bg-[#1a1a1a] text-zinc-400 shadow-sm">Enter</kbd> to send
        </span>
        <span className="w-1 h-1 rounded-full bg-border/20" />
        <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 text-[10px] font-mono rounded-md border border-border/10 bg-[#1a1a1a] text-zinc-400 shadow-sm">Shift + Enter</kbd> new line
        </span>
      </div>
    </div>
  );
}
