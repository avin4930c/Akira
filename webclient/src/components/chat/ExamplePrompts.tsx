import { Button } from '@/components/ui/button';

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
  prompts?: string[];
}

const defaultPrompts = [
  "How often should I change my motorcycle oil?",
  "My bike won't start, what should I check?",
  "Best practices for winter motorcycle storage",
  "How to adjust my motorcycle's chain tension?"
];

export default function ExamplePrompts({ 
  onSelectPrompt, 
  prompts = defaultPrompts 
}: ExamplePromptsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">Try asking:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className="text-left h-auto p-3 text-sm hover:bg-accent/10"
            onClick={() => onSelectPrompt(prompt)}
          >
            "{prompt}"
          </Button>
        ))}
      </div>
    </div>
  );
}
