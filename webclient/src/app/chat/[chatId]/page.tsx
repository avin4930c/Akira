'use client'

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChatMessage } from '@/types/chat';
import ChatMessageSection from '@/components/chat/ChatMessageSection';
import ChatInput from '@/components/chat/ChatInput';
import ChatHeader from '@/components/chat/ChatHeader';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get('message');

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const defaultMessages: ChatMessage[] = [
      {
        id: '1',
        content: "Hello! I'm Akira, your AI assistant for all things motorcycle. I can help you with maintenance, troubleshooting, riding tips, and more. What would you like to know?",
        sender: 'assistant',
        timestamp: new Date('2025-08-28T09:00:00Z'),
      },
    ];

    // If there's an initial message from the URL, add it and a response
    if (initialMessage) {
      const userMessage: ChatMessage = {
        id: '2',
        content: initialMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      return [...defaultMessages, userMessage];
    }

    return defaultMessages;
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle initial message from URL
  useEffect(() => {
    if (initialMessage && messages.length === 2) {
      // Simulate AI response to the initial message
      setIsTyping(true);
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: '3',
          content: "That's a great question about motorcycles! I'd be happy to help you with that. However, this is currently a demo interface. In the full version, I would provide detailed, accurate information about motorcycle maintenance, troubleshooting, and riding techniques based on your specific question.",
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 2000);
    }
  }, [initialMessage, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "That's a great question about motorcycles! I'd be happy to help you with that. However, this is currently a demo interface. In the full version, I would provide detailed, accurate information about motorcycle maintenance, troubleshooting, and riding techniques based on your specific question.",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <>
      <ChatHeader />
      <ChatMessageSection messages={messages} isTyping={isTyping} messagesEndRef={messagesEndRef} />
      <ChatInput inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={handleSendMessage} isTyping={isTyping} />
    </>
  );
}