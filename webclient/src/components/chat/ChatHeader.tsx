import { Bot } from 'lucide-react'
import React from 'react'

const ChatHeader = () => {
    return (
        <div className="p-6 border-b border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Akira Chat</h1>
                    <p className="text-sm text-muted-foreground">Your AI motorcycle assistant</p>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader