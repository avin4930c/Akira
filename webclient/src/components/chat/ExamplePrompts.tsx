import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

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
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Suggestions</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
        {prompts.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
            onClick={() => onSelectPrompt(prompt)}
            className="group flex items-start gap-4 text-left p-4 rounded-xl border border-border/10 bg-[#111111] 
              hover:border-accent/30 hover:bg-[#161616] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_15px_hsl(24_100%_58%/0.05)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="w-16 h-16 bg-accent/10 rounded-full blur-xl transform translate-x-4 -translate-y-4" />
            </div>
            <span className="text-[14px] text-zinc-400 group-hover:text-zinc-200 transition-colors leading-relaxed flex-1 relative z-10 font-medium">
              {prompt}
            </span>
            <div className="p-1.5 rounded-lg bg-[#1a1a1a] border border-border/5 group-hover:bg-accent/10 group-hover:border-accent/20 transition-colors relative z-10">
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-accent transition-colors" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
