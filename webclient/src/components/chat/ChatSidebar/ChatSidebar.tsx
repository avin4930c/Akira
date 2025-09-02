import { Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar'
import { ChatSession } from '@/types/chat';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'
import ChatSessionBox from './ChatSessionBox';

interface ChatSidebarProps {
  sessions: ChatSession[];
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ sessions }) => {
  return (
    <Sidebar className="md:w-[320px] border-r border-border/50">
          <SidebarContent className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Chat History</h2>
              <SidebarTrigger />
            </div>
            
            {/* New Chat Button */}
            <Link href="/chat" className="block mb-4">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </Link>
            
            <div className="space-y-2">
              {sessions.map((session) => (
                <ChatSessionBox key={session.id} session={session} />
              ))}
            </div>
          </SidebarContent>
        </Sidebar>
  )
}

export default ChatSidebar