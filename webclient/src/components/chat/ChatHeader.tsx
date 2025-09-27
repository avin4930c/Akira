import { Bot, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

interface ChatHeaderProps {
    isConnected?: boolean;
    error?: string | null;
    onRetry?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isConnected = true, error, onRetry }) => {
    return (
        <div className="p-6 border-b border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                        <Bot className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">Akira Chat</h1>
                        <p className="text-sm text-muted-foreground">Your AI motorcycle assistant</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {error && onRetry && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRetry}
                            className="h-8"
                        >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Retry
                        </Button>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm">
                        {isConnected ? (
                            <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                            <WifiOff className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                            {error ? 'Connection Error' : isConnected ? 'Connected' : 'Connecting...'}
                        </span>
                    </div>
                </div>
            </div>
            
            {error && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
        </div>
    )
}

export default ChatHeader