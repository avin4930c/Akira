import { Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar'
import { ChatThread } from '@/types/chat';
import React from 'react'
import ChatThreadBox from './ChatThreadBox';
import NewChatButton from '../NewChatButton';
import { MessageCircle } from 'lucide-react';

interface ChatSidebarProps {
  threads?: ChatThread[];
  loading?: boolean;
  error?: Error | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ threads, loading, error }) => {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-2 mt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-muted/30 animate-pulse" />
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="mt-20 text-sm text-destructive text-center">Failed to load threads</p>;
    }

    if (!threads || threads.length === 0) {
      return (
        <div className="mt-20 text-center space-y-4 p-4">
          <MessageCircle className="w-8 h-8 mx-auto text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No conversations yet</p>
          <NewChatButton />
        </div>
      );
    }

    return (
        <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest font-mono">Chat History</h2>
          <SidebarTrigger className="text-zinc-400 hover:text-accent md:hidden" />
        </div>

        <NewChatButton />

        <div className="space-y-1.5 mt-6 pb-20">
          {threads.map((thread) => (
            <ChatThreadBox key={thread.id} thread={thread} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Sidebar className="md:w-[280px] border-r border-white/5 bg-background/40 backdrop-blur-md group-data-[side=left]:border-r-0 z-40" variant="sidebar">
      <SidebarContent className="bg-transparent scrollbar-none pt-[76px]">
        {renderContent()}
      </SidebarContent>
    </Sidebar>
  );
}

export default ChatSidebar