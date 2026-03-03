import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';

export default function WelcomeHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 flex flex-col items-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative w-20 h-20 mx-auto rounded-2xl border border-border/10 bg-[#111111] flex items-center justify-center shadow-[0_0_40px_hsl(24_100%_58%/0.1)] group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <Bot className="w-10 h-10 text-accent relative z-10" />
      </motion.div>
      
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/[0.04] shadow-[0_0_15px_hsl(24_100%_58%/0.1)] backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-[13px] font-medium tracking-wide text-foreground">Akira AI Assistant</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
          How can I help?
        </h1>
        
        <p className="text-zinc-400 max-w-lg mx-auto text-[15px] sm:text-base leading-relaxed">
          Ask me about diagnostics, maintenance, riding tips, or anything motorcycle-related.
        </p>
      </div>
    </motion.div>
  );
}
