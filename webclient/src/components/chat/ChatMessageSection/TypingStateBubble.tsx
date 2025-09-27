import React from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import TypingIndicator from '../TypingIndicator'

export const TypingStateBubble: React.FC = () => {
  return (
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
            <TypingIndicator />
          </div>
        </div>
      </div>
    </motion.div>
  )
}