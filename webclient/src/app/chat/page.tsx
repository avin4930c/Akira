'use client'

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Send, Bot, User, Menu, MessageCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '@/components/common/Navigation';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: Date;
}

const ChatSidebar = () => {
  const [sessions] = useState<ChatSession[]>([
    { id: '1', title: 'Motorcycle maintenance basics', lastMessage: new Date() },
    { id: '2', title: 'Engine troubleshooting', lastMessage: new Date(Date.now() - 86400000) },
    { id: '3', title: 'Brake system questions', lastMessage: new Date(Date.now() - 172800000) },
  ]);

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarContent className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Chat History</h2>
          <SidebarTrigger />
        </div>
        
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-border/30"
            >
              <div className="flex items-center space-x-2 mb-1">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground truncate">
                  {session.title}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{session.lastMessage.toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Akira, your AI assistant for all things motorcycle. I can help you with maintenance, troubleshooting, riding tips, and more. What would you like to know?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
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
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "That's a great question about motorcycles! I'd be happy to help you with that. However, this is currently a demo interface. In the full version, I would provide detailed, accurate information about motorcycle maintenance, troubleshooting, and riding techniques based on your specific question.",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <SidebarProvider>
        <div className="flex w-full pt-16">
          <ChatSidebar />
          
          <main className="flex-1 flex flex-col h-screen pt-0">
            {/* Chat Header */}
            <div className="p-6 border-b border-border/50 bg-background/80 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Akira Chat</h1>
                  <p className="text-sm text-muted-foreground">Your AI motorcycle assistant</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground ml-3' 
                          : 'bg-gradient-accent text-accent-foreground mr-3'
                      }`}>
                        {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 text-foreground border border-border/30'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex space-x-3 max-w-[80%]">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-accent text-accent-foreground flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="rounded-2xl px-4 py-3 bg-muted/50 border border-border/30">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
                <div className="flex space-x-3 items-end">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about motorcycles..."
                      className="pr-12 py-3 text-sm resize-none bg-muted/30 border-border/50 focus:border-accent/50 rounded-xl"
                      disabled={isTyping}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    variant="hero"
                    size="icon"
                    className="w-11 h-11"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Akira can make mistakes. Consider checking important information.
                </p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}