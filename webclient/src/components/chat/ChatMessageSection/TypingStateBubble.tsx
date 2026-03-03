import React from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import TypingIndicator from '../TypingIndicator'

export const TypingStateBubble: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start w-full"
    >
      <div className="flex gap-4 w-full max-w-4xl">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm bg-[#111111] border-accent/20 text-accent shadow-[0_0_15px_hsl(24_100%_58%/0.15)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
          <Bot className="w-5 h-5 relative z-10 animate-pulse" />
        </div>
        <div className="flex flex-col space-y-2">
            <div className="rounded-2xl rounded-tl-md px-5 py-4 w-fit bg-[#111111] border border-border/10 border-l-2 border-l-accent/50 text-zinc-300 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-50 pointer-events-none">
                    <div className="w-24 h-24 bg-accent/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
                </div>
                <div className="flex items-center gap-2 relative z-10">
                    <span className="text-sm font-medium text-accent">Processing</span>
                    <TypingIndicator />
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  )
}