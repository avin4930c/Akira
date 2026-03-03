import React from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

export const EmptyState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#111111] border border-border/10 flex items-center justify-center shadow-[0_0_30px_hsl(24_100%_58%/0.05)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
          <Bot className="w-8 h-8 text-accent/50 relative z-10" />
        </div>
        <p className="text-lg font-semibold text-zinc-200 mb-2">Start a conversation</p>
        <p className="text-[15px] text-zinc-500">Type your question below to begin.</p>
      </motion.div>
    </div>
  )
}