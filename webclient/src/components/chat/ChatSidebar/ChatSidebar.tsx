import { Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar'
import { ChatThread } from '@/types/chat';
import React from 'react'
import ChatSessionBox from './ChatThreadBox';
import NewChatButton from '../NewChatButton';

interface ChatSidebarProps {
  threads?: ChatThread[];
  loading?: boolean;
  error?: Error | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ threads, loading, error }) => {
  if (loading) {
    return (
      <div className="md:w-[320px] border-r border-border/50 p-4">
        <p className="text-sm text-muted-foreground">Loading chat threads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:w-[320px] border-r border-border/50 p-4">
        <p className="text-sm text-red-500">Error loading chat threads</p>
      </div>
    );
  }

  if (!threads || threads.length === 0) {
    return (
      <div className="md:w-[320px] border-r border-border/50 p-4">
        <p className="text-sm text-muted-foreground">No chat threads available. Start a new chat!</p>
        <NewChatButton />
      </div>
    );
  }

  return (
    <Sidebar className="md:w-[320px] border-r border-border/50">
      <SidebarContent className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Chat History</h2>
          <SidebarTrigger />
        </div>

        <NewChatButton />

        <div className="space-y-2">
          {threads.map((thread) => (
            <ChatSessionBox key={thread.id} thread={thread} />
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  )
}

export default ChatSidebar