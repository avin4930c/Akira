'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ChatWelcome from '@/components/chat/ChatWelcome/ChatWelcome';
import { useCreateThreadMutation } from '@/hooks/chat/useChat';
import { usePendingMessageStore } from '@/stores/pendingMessageStore';

export default function ChatHomePage() {
  const router = useRouter();
  const createThreadMutation = useCreateThreadMutation();
  const { setPendingMessage } = usePendingMessageStore();
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  const title = "Akira New Chat"

  const handleStartChat = async (message: string) => {
    if (!message.trim() || isCreatingThread) return;

    setIsCreatingThread(true);

    try {
      const newThread = await createThreadMutation.mutateAsync(title);
      const newThreadId = newThread.id;

      setPendingMessage(newThreadId, message.trim());

      router.push(`/chat/${newThreadId}`);
    } catch (error) {
      console.error('Failed to create new chat:', error);
      setIsCreatingThread(false);
    }
  };

  return <ChatWelcome onStartChat={handleStartChat} isCreating={isCreatingThread} />;
}