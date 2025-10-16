'use client'

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useChatWebSocket } from '@/hooks/chat/useChatWebsocket';
import { useChatThreads, useThreadMessages } from '@/hooks/chat/useChat';
import { useChatInvalidation } from '@/hooks/chat/useChatInvalidation';
import { ChatMessage, StreamingMessage, Sender, AIResponseStreamData, ErrorWebSocketData } from '@/types/chat';
import ChatInterface from '@/components/screens/chat/ChatInterface';
import { usePendingMessageStore } from '@/stores/pendingMessageStore';
import { toast } from 'sonner';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { data: threads } = useChatThreads();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<StreamingMessage | null>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const { invalidateThreads } = useChatInvalidation();

  const accumulatedContentRef = useRef<string>('');
  const currentStreamingIdRef = useRef<string | null>(null);
  const { consumePendingMessage, hasPendingMessage, clearOldMessages } = usePendingMessageStore();


  const {
    data: initialMessages,
    isLoading: isLoadingMessages,
    error: messagesError
  } = useThreadMessages(chatId);

  const handleStreamingMessage = useCallback((data: AIResponseStreamData) => {
    setIsWaitingForResponse(false);

    if (currentStreamingIdRef.current !== data.id) {
      accumulatedContentRef.current = '';
      currentStreamingIdRef.current = data.id;
    }

    accumulatedContentRef.current += data.content;

    if (data.partial) {
      const streamingMsg: StreamingMessage = {
        id: data.id,
        threadId: data.thread_id,
        content: accumulatedContentRef.current,
        partial: true,
        timestamp: data.timestamp,
        sender: data.sender as Sender,
      };

      setStreamingMessage(streamingMsg);
    } else {
      const finalMessage: ChatMessage = {
        id: data.id,
        threadId: data.thread_id,
        content: accumulatedContentRef.current,
        sender: data.sender as Sender,
        createdAt: data.timestamp,
      };

      setStreamingMessage(null);
      setMessages(prev => [...prev, finalMessage]);

      accumulatedContentRef.current = '';
      currentStreamingIdRef.current = null;
    }

    if (threads?.[0]?.id !== chatId) {
      invalidateThreads();
    }
  }, [invalidateThreads, chatId, threads]);

  const handleThreadUpdate = useCallback(() => {
    invalidateThreads();
  }, [invalidateThreads]);

  const handleStreamingError = useCallback((data: ErrorWebSocketData) => {
    console.error('WebSocket streaming error:', data.message);
    setIsWaitingForResponse(false);

    // If we have accumulated content, save it as incomplete message
    if (accumulatedContentRef.current && currentStreamingIdRef.current) {
      const incompleteMessage: ChatMessage = {
        id: currentStreamingIdRef.current,
        threadId: chatId,
        content: `${accumulatedContentRef.current}\n\n⚠️ *Response was interrupted due to an error*`,
        sender: Sender.ASSISTANT,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, incompleteMessage]);
    }

    setStreamingMessage(null);
    accumulatedContentRef.current = '';
    currentStreamingIdRef.current = null;
  }, [chatId]);

  const handleConnectionError = useCallback((error: string) => {
    console.error('WebSocket connection error:', error);
  }, []);

  const {
    isConnected,
    isStreaming,
    error: wsError,
    sendMessage,
    retry,
  } = useChatWebSocket({
    threadId: chatId,
    onStreamingMessage: handleStreamingMessage,
    onStreamingError: handleStreamingError,
    onConnectionError: handleConnectionError,
    onThreadUpdate: handleThreadUpdate,
  });

  const handleSendMessage = useCallback((message: string) => {
    if (message && isConnected) {
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        threadId: chatId,
        content: message,
        sender: Sender.USER,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage]);
      setIsWaitingForResponse(true);
      sendMessage(message);

      return true;
    }
  }, [isConnected, sendMessage, chatId]);

  // Auto-send pending message when WebSocket connects
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (isConnected && chatId) {
        const fetchPendingMessage = hasPendingMessage(chatId);
        if (fetchPendingMessage) {
          const pendingMessage = consumePendingMessage(chatId);
          if (pendingMessage) {
            const sentMessage = handleSendMessage(pendingMessage);
            if (sentMessage) clearOldMessages();
          }
          else {
            toast.error("Failed to send your initial message. Please enter it again.");
          }
        }
      }
    }, 100);

    return () => clearTimeout(timeOutId);
  }, [isConnected, chatId]);

  useEffect(() => {
    if (initialMessages && messages.length === 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages, messages.length]);

  useEffect(() => {
    setMessages([]);
    setStreamingMessage(null);
    setIsWaitingForResponse(false);
    accumulatedContentRef.current = '';
    currentStreamingIdRef.current = null;
  }, [chatId]);

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-2">Invalid Chat ID</p>
          <p className="text-sm text-muted-foreground">Please select a valid chat from the sidebar.</p>
        </div>
      </div>
    );
  }

  return (
    <ChatInterface
      messages={messages}
      streamingMessage={streamingMessage}
      isConnected={isConnected}
      isLoading={isLoadingMessages || isStreaming}
      isWaitingForResponse={isWaitingForResponse}
      error={wsError || messagesError?.message}
      onSendMessage={handleSendMessage}
      onRetry={retry}
    />
  );
}