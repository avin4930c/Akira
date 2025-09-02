'use client'

import { SidebarProvider } from '@/components/ui/sidebar';
import Navigation from '@/components/common/Navigation';
import { ChatSession } from '@/types/chat';
import ChatSidebar from '@/components/chat/ChatSidebar/ChatSidebar';
import { useState } from 'react';

// Mock sessions data - will be replaced with API call later
const mockSessions: ChatSession[] = [
  { id: '1', title: 'Motorcycle maintenance basics', lastMessage: new Date('2025-08-28T10:00:00Z') },
  { id: '2', title: 'Engine troubleshooting', lastMessage: new Date('2025-08-27T15:30:00Z') },
  { id: '3', title: 'Brake system questions', lastMessage: new Date('2025-08-26T09:15:00Z') },
];

export default function ChatLayout({ children }: {
    children: React.ReactNode;
}) {
    const [sessions] = useState<ChatSession[]>(mockSessions);

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <Navigation />

            <SidebarProvider>
                <div className="flex w-full pt-16">
                    <ChatSidebar sessions={sessions} />

                    <main className="flex-1 flex flex-col h-screen pt-0 ml-0 md:ml-64">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}