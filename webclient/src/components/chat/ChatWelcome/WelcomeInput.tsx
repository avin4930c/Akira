import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

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

  const inputValue = externalValue !== undefined ? externalValue : internalValue;
  const handleChange = externalOnChange || setInternalValue;

  const handleSubmit = () => {
    if (!inputValue.trim() || isCreating) return;
    onStartChat(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 text-base pr-12 border-border/50 focus:border-accent"
          onKeyDown={(e) => handleKeyPress(e)}
        />
        <Button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isCreating}
          size="sm"
          className="absolute top-1/2 -translate-y-1/2 right-3"
        >
          {isCreating ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
