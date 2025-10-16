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
  updatedAt: string;
}

export interface ChatSummary {
  id: string;
  threadId: string;
  content: string;
  lastMessageId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface StreamingMessage {
  id: string;
  threadId: string;
  content: string;
  partial: boolean;
  timestamp: string;
  sender: Sender;
}

export interface AIResponseStreamData {
  id: string;
  content: string;
  thread_id: string;
  partial: boolean;
  timestamp: string;
  sender: Sender;
}

export interface ThreadUpdateData {
  thread_id: string;
  title: string;
  updated: string;
}

export interface WebSocketMessage {
  type: 'ai_response_stream' | 'error' | 'thread_update';
  data: AIResponseStreamData | { message: string } | ThreadUpdateData;
}

export interface MessageState {
  messages: ChatMessage[];
  streamingMessage: StreamingMessage | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChatRequest {
  message: string;
  thread_id: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface ErrorWebSocketData {
  message: string;
}

export type WebSocketData = AIResponseStreamData | ErrorWebSocketData;