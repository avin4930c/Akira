import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { AIResponseStreamData, ChatRequest, ErrorWebSocketData, ThreadUpdateData, WebSocketMessage } from '@/types/chat';

interface UseChatWebSocketProps {
  threadId: string;
  onStreamingMessage: (data: AIResponseStreamData) => void;
  onStreamingError: (data: ErrorWebSocketData) => void;
  onConnectionError?: (error: string) => void;
  onThreadUpdate?: (data: ThreadUpdateData) => void;
}

interface WebSocketState {
  isConnected: boolean;
  isStreaming: boolean;
  error: string | null;
}

export const useChatWebSocket = ({
  threadId,
  onStreamingMessage,
  onStreamingError,
  onConnectionError,
  onThreadUpdate
}: UseChatWebSocketProps) => {
  const { getToken } = useAuth();
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isStreaming: false,
    error: null,
  });

  const threadIdRef = useRef<string>(threadId);
  const callbacksRef = useRef({
    onStreamingMessage,
    onStreamingError,
    onConnectionError,
    onThreadUpdate
  });

  useEffect(() => {
    threadIdRef.current = threadId;
    callbacksRef.current = {
      onStreamingMessage,
      onStreamingError,
      onConnectionError,
      onThreadUpdate
    };
  }, [threadId, onStreamingMessage, onStreamingError, onConnectionError, onThreadUpdate]);

  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const isConnectingRef = useRef(false);
  const isIntentionalDisconnectRef = useRef(false);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    isIntentionalDisconnectRef.current = true;

    if (websocketRef.current) {
      if (websocketRef.current.readyState === WebSocket.OPEN ||
        websocketRef.current.readyState === WebSocket.CONNECTING) {
        console.log(`Closing WebSocket for thread: ${threadIdRef.current}`);
        websocketRef.current.close();
      }
      websocketRef.current = null;
    }

    isConnectingRef.current = false;
  }, []);

  const connect = useCallback(async () => {
    if (!threadIdRef.current || isConnectingRef.current) {
      return;
    }

    cleanup();

    isIntentionalDisconnectRef.current = false;
    isConnectingRef.current = true;

    console.log(`Connecting WebSocket for thread: ${threadIdRef.current}`);

    try {
      const token = await getToken();
      if (!token) {
        const error = 'Authentication required to connect to chat';
        setState(prev => ({ ...prev, error }));
        callbacksRef.current.onConnectionError?.(error);
        isConnectingRef.current = false;
        return;
      }

      const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
      if (!wsUrl) {
        const error = 'WebSocket URL is not configured';
        setState(prev => ({ ...prev, error }));
        callbacksRef.current.onConnectionError?.(error);
        isConnectingRef.current = false;
        return;
      }

      const ws = new WebSocket(wsUrl, [`bearer`, token]);
      websocketRef.current = ws;

      ws.onopen = () => {
        console.log(`WebSocket connected for thread: ${threadIdRef.current}`);
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
          const message = JSON.parse(event.data) as WebSocketMessage;

          switch (message.type) {
            case 'ai_response_stream': {
              const streamData = message.data as AIResponseStreamData;

              if (streamData.thread_id === threadIdRef.current) {
                setState(prev => ({ ...prev, isStreaming: true }));
                callbacksRef.current.onStreamingMessage(streamData);

                if (!streamData.partial) {
                  setState(prev => ({ ...prev, isStreaming: false }));
                }
              } else {
                console.warn(`Ignoring message for wrong thread: ${streamData.thread_id}, current: ${threadIdRef.current}`);
              }
              break;
            }

            case 'thread_update': {
              const updateData = message.data as ThreadUpdateData;
              callbacksRef.current.onThreadUpdate?.(updateData);
              break;
            }

            case 'error': {
              const errorData = message.data as ErrorWebSocketData;
              console.error('WebSocket error:', errorData.message);
              setState(prev => ({
                ...prev,
                isStreaming: false,
                error: errorData.message,
              }));
              callbacksRef.current.onStreamingError(errorData);
              break;
            }

            default:
              console.warn('Unknown WebSocket message type:', message.type);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          setState(prev => ({ ...prev, error: 'Failed to process server message' }));
        }
      };

      ws.onclose = (event) => {
        console.log(`WebSocket disconnected for thread: ${threadIdRef.current}, code: ${event.code}, reason: ${event.reason}`);
        isConnectingRef.current = false;

        setState(prev => ({
          ...prev,
          isConnected: false,
          isStreaming: false,
        }));

        // Only attempt reconnect if not intentionally closed and within retry limits
        if (!isIntentionalDisconnectRef.current && event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current + 1}) for thread: ${threadIdRef.current}`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        isConnectingRef.current = false;

        const errorMsg = 'WebSocket connection error';
        setState(prev => ({ ...prev, error: errorMsg }));
        callbacksRef.current.onConnectionError?.(errorMsg);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      isConnectingRef.current = false;
      setState(prev => ({ ...prev, error: 'Failed to connect to chat server' }));
    }
  }, [getToken, cleanup]);

  const sendMessage = useCallback((content: string, metadata?: Record<string, string | number | boolean>) => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      const error = 'WebSocket is not connected';
      setState(prev => ({ ...prev, error }));
      callbacksRef.current.onConnectionError?.(error);
      return;
    }

    try {
      const request: ChatRequest = {
        message: content,
        thread_id: threadIdRef.current,
        metadata,
      };

      console.log(`Sending message to thread: ${threadIdRef.current}`);
      websocketRef.current.send(JSON.stringify(request));
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMsg = 'Failed to send message';
      setState(prev => ({ ...prev, error: errorMsg }));
      callbacksRef.current.onConnectionError?.(errorMsg);
    }
  }, []);

  useEffect(() => {
    // If threadId changes, we need to reconnect
    console.log(`Thread ID changed: ${threadId}`);

    // Clean up any existing connection
    cleanup();

    // Reset state
    setState({
      isConnected: false,
      isStreaming: false,
      error: null
    });

    // Connect with new thread ID
    connect();

    return () => {
      cleanup();
    };
  }, [threadId, cleanup, connect]);

  return {
    ...state,
    sendMessage,
    connect,
    disconnect: cleanup,
    retry: connect,
  };
};