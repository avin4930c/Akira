'use client'

import ChatSidebar from '@/components/chat/ChatSidebar/ChatSidebar';
import { useChatThreads } from '@/hooks/chat/useChat';
import { SidebarInset } from '@/components/ui/sidebar';

interface ChatLayoutClientProps {
    children: React.ReactNode;
}

export default function ChatLayoutClient({ children }: ChatLayoutClientProps) {
    const { data: threads, error, isLoading } = useChatThreads();

    return (
        <>
            <ChatSidebar threads={threads} loading={isLoading} error={error} />
            <SidebarInset className="flex-1 flex flex-col relative bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-accent/5 via-background to-background h-screen w-full overflow-hidden border-none m-0 p-0 shadow-none bg-transparent pt-[76px]">
                {children}
            </SidebarInset>
        </>
    );
}