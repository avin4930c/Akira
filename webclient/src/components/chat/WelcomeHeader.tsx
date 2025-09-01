import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function WelcomeHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-center space-x-2">
        <Sparkles className="w-8 h-8 text-accent" />
        <h1 className="text-4xl font-bold text-shimmer">Akira AI</h1>
      </div>
      <p className="text-xl text-muted-foreground">
        Your intelligent motorcycle assistant
      </p>
      <p className="text-muted-foreground">
        Ask me about maintenance, troubleshooting, riding tips, or anything motorcycle-related!
      </p>
    </motion.div>
  );
}
