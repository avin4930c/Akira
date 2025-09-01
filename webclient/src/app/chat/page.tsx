'use client'

import { useRouter } from 'next/navigation';
import ChatWelcome from '@/components/chat/ChatWelcome';

export default function ChatHomePage() {
  const router = useRouter();

  const handleStartChat = async (message: string) => {
    //TODO: Make this an api call for creating new session
    const newChatId = Date.now().toString();
    
    router.push(`/chat/${newChatId}?message=${encodeURIComponent(message)}`);
  };

  return <ChatWelcome onStartChat={handleStartChat} />;
}