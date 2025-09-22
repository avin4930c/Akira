import { ChatThread } from '@/types/chat';
import { Clock, MessageCircle } from 'lucide-react';
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

    return (
        <Link href={`/chat/${thread.id}`}>
            <div
                className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 border ${isActive
                        ? 'bg-accent/20 border-accent/30 text-accent-foreground'
                        : 'bg-muted/30 hover:bg-muted/50 border-transparent hover:border-border/30'
                    }`}
            >
                <div className="flex items-center space-x-2 mb-1">
                    <MessageCircle className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium truncate">
                        {thread.title}
                    </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{thread.updatedAt ? new Date(thread.updatedAt).toLocaleString('en-US') : "Last updated unknown"}</span>
                </div>
            </div>
        </Link>
    );
}

export default ChatThreadBox