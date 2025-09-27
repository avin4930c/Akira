import React from 'react'
import { Bot } from 'lucide-react'

export const EmptyState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center text-muted-foreground">
        <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-2">Start a conversation</p>
        <p className="text-sm">Ask me anything about motorcycles!</p>
      </div>
    </div>
  )
}