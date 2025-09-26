import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { 
  WebSocketMessage, 
  ChatRequest,
  AIResponseStreamData,
  ErrorWebSocketData
} from '@/types/chat';

interface UseChatWebSocketProps {
  threadId: string;
  onStreamingMessage: (data: AIResponseStreamData) => void;
  onStreamingError: (data: ErrorWebSocketData) => void;
  onConnectionError?: (error: string) => void;
}

interface WebSocketState {
  isConnected: boolean;
  isStreaming: boolean;
  error: string | null;
}

export const useChatWebSocket = ({ threadId, onStreamingMessage, onStreamingError, onConnectionError }: UseChatWebSocketProps) => {
  const { getToken } = useAuth();
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isStreaming: false,
    error: null,
  });

  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const isConnectingRef = useRef(false);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    isConnectingRef.current = false;
  }, []);

  const connect = useCallback(async () => {
    if (!threadId || isConnectingRef.current || websocketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    isConnectingRef.current = true;
    cleanup();

    try {
      const token = await getToken();
      if (!token) {
        setState(prev => ({
          ...prev,
          error: 'Authentication required to connect to chat',
        }));
        onConnectionError?.('Authentication required to connect to chat');
        return;
      }

      const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8000/chat/ws';
      
      const ws = new WebSocket(wsUrl, [`bearer`, token]);
      websocketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts.current = 0;
        isConnectingRef.current = false;
        setState(prev => ({
          ...prev,
          isConnected: true,
          error: null,
        }));
      };

      ws.onmessage = (event) => {
        try {
          const wsMessage: WebSocketMessage = JSON.parse(event.data);
          handleWebSocketMessage(wsMessage);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          setState(prev => ({
            ...prev,
            error: 'Failed to parse message from server',
          }));
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        isConnectingRef.current = false;
        setState(prev => ({
          ...prev,
          isConnected: false,
          isStreaming: false,
        }));

        // Attempt to reconnect if not manually closed
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const timeout = Math.pow(2, reconnectAttempts.current) * 1000;
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, timeout);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        isConnectingRef.current = false;
        const errorMessage = 'WebSocket connection error';
        setState(prev => ({
          ...prev,
          error: errorMessage,
        }));
        onConnectionError?.(errorMessage);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      isConnectingRef.current = false;
      setState(prev => ({
        ...prev,
        error: 'Failed to connect to chat server',
      }));
    }
  }, [threadId, onConnectionError, cleanup, getToken]);

  const handleWebSocketMessage = useCallback((wsMessage: WebSocketMessage) => {
    switch (wsMessage.type) {
      case 'ai_response_stream':
        const streamData = wsMessage.data as AIResponseStreamData;
        setState(prev => ({ ...prev, isStreaming: streamData.partial }));
        onStreamingMessage(streamData);
        break;
      case 'error':
        const errorData = wsMessage.data as ErrorWebSocketData;
        const errorMsg = errorData.message || 'Unknown error occurred';
        setState(prev => ({
          ...prev,
          error: errorMsg,
          isStreaming: false,
        }));
        onConnectionError?.(errorMsg);
        onStreamingError(errorData);
        break;
      default:
        console.warn('Unknown WebSocket message type:', wsMessage.type);
    }
  }, [onStreamingMessage, onStreamingError, onConnectionError]);

  const sendMessage = useCallback((content: string, metadata?: Record<string, string | number | boolean>) => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      const error = 'WebSocket is not connected';
      setState(prev => ({ ...prev, error }));
      onConnectionError?.(error);
      return;
    }

    try {
      const request: ChatRequest = {
        message: content,
        thread_id: threadId,
        metadata,
      };

      websocketRef.current.send(JSON.stringify(request));
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMsg = 'Failed to send message';
      setState(prev => ({
        ...prev,
        error: errorMsg,
      }));
      onConnectionError?.(errorMsg);
    }
  }, [threadId, onConnectionError]);

  useEffect(() => {
    connect();
    return cleanup;
  }, [connect, cleanup]);

  const disconnect = useCallback(() => {
    cleanup();
    setState(prev => ({
      ...prev,
      isConnected: false,
      isStreaming: false,
    }));
  }, [cleanup]);

  return {
    ...state,
    sendMessage,
    connect,
    disconnect,
    retry: connect,
  };
};