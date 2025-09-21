'use client'

import { SidebarProvider } from '@/components/ui/sidebar';
import Navigation from '@/components/common/Navigation';
import ChatSidebar from '@/components/chat/ChatSidebar/ChatSidebar';
import { useChatThreads } from '@/hooks/chat/useChat';

export default function ChatLayout({ children }: {
    children: React.ReactNode;
}) {
    const {data: threads, error, isLoading} = useChatThreads();

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <Navigation />

            <SidebarProvider>
                <div className="flex w-full pt-16">
                    <ChatSidebar threads={threads} loading={isLoading} error={error} />

                    <main className="flex-1 flex flex-col max-h-[calc(100vh-64px)] pt-0 ml-0 md:ml-80">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}