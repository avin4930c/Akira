"use client"

import { ChatThread } from '@/types/chat';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

interface ChatThreadBoxProps {
    thread: ChatThread;
}

const ChatThreadBox: React.FC<ChatThreadBoxProps> = ({ thread }) => {
    const params = useParams();
    const currentChatId = params.chatId as string;
    const isActive = currentChatId === thread.id;

    const timeAgo = thread.updatedAt 
        ? new Date(thread.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '';

    return (
        <Link href={`/chat/${thread.id}`}>
            <div
                className={`group px-3 py-3 rounded-xl cursor-pointer transition-all duration-300 border ${
                    isActive
                        ? 'bg-[#111111] border-accent/20 text-zinc-100 shadow-[0_0_15px_hsl(24_100%_58%/0.05)]'
                        : 'bg-transparent border-transparent text-zinc-500 hover:bg-[#111111] hover:border-border/10 hover:text-zinc-300'
                }`}
            >
                <div className="flex items-center gap-3">
                    <MessageCircle className={`w-[14px] h-[14px] flex-shrink-0 transition-colors ${isActive ? 'text-accent' : 'group-hover:text-accent/70'}`} />
                    <span className="text-[13px] font-medium truncate flex-1 tracking-wide">
                        {thread.title}
                    </span>
                    {timeAgo && (
                        <span className="text-[10px] font-mono text-zinc-600 flex-shrink-0">
                            {timeAgo}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default ChatThreadBox