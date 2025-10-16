import { SidebarProvider } from '@/components/ui/sidebar';
import Navigation from '@/components/common/Navigation';
import ChatLayoutClient from './ChatLayoutClient';

export default function ChatLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-subtle">
            <Navigation />
            <SidebarProvider>
                <ChatLayoutClient>
                    {children}
                </ChatLayoutClient>
            </SidebarProvider>
        </div>
    );
}