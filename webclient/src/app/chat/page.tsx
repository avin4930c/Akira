'use client'

import { useRouter } from 'next/navigation';
import ChatWelcome from '@/components/chat/ChatWelcome';
import { useCreateThreadMutation } from '@/hooks/chat/useChat';

export default function ChatHomePage() {
  const router = useRouter();
  const createThreadMutation = useCreateThreadMutation();

  const title = "Akira New Chat"

  const handleStartChat = async () => {
    const newThread = await createThreadMutation.mutateAsync(title);
    const newThreadId = newThread.id;
    router.push(`/chat/${newThreadId}`);
  };

  return <ChatWelcome onStartChat={handleStartChat} />;
}