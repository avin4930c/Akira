export enum Sender {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface ChatMessage {
  id: string;
  threadId: string;
  content: string;
  sender: Sender;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatSummary {
  id: string;
  threadId: string;
  content: string;
  lastMessageId: string;
  createdAt: string;
  updatedAt?: string;
}