import { Bot, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'

interface ChatHeaderProps {
    isConnected?: boolean;
    error?: string | null;
    onRetry?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isConnected = true, error, onRetry }) => {
    return (
        <div className="px-4 md:px-6 py-3 md:py-4 bg-[#0a0a0a] border-b border-border/10 sticky top-0 z-30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                    <SidebarTrigger className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-[#111111]" />

                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#111111] border border-border/10 shadow-[0_0_15px_hsl(24_100%_58%/0.15)] flex items-center justify-center relative overflow-hidden group shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                        <Bot className="w-5 h-5 text-accent relative z-10" />
                    </div>
                    
                    <div className="min-w-0">
                        <h1 className="text-[13px] md:text-[15px] font-semibold tracking-wide text-zinc-100 truncate">Akira Intelligence</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="relative flex h-1.5 w-1.5 shrink-0">
                                {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/50 opacity-75"></span>}
                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isConnected ? 'bg-emerald-500' : error ? 'bg-red-500' : 'bg-amber-500 animate-pulse'}`}></span>
                            </span>
                            <span className="text-[10px] md:text-[12px] font-mono tracking-wider text-zinc-500 truncate">
                                {error ? 'ERR_CONNECTION' : isConnected ? 'SYSTEM_ONLINE' : 'CONNECTING...'}
                            </span>
                        </div>
                    </div>
                </div>

                {error && onRetry && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRetry}
                        className="h-7 text-xs text-zinc-400 hover:text-zinc-100 shrink-0"
                    >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Retry Connection</span>
                        <span className="sm:hidden">Retry</span>
                    </Button>
                )}
            </div>

            {error && (
                <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
                    <p className="text-xs text-destructive flex items-center gap-2">
                        <span className="shrink-0 w-1 h-1 rounded-full bg-destructive" />
                        {error}
                    </p>
                </div>
            )}
        </div>
    )
}

export default ChatHeader