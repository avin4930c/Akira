import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ProcessingStage } from "@/types/mia";
import { SSEEventType, ProcessingState } from "@/types/sse";

interface UseServiceJobSSEOptions {
  onComplete?: (jobId: string) => void;
  onError?: (jobId: string, error: string) => void;
  onStageUpdate?: (jobId: string, stage: ProcessingStage, progress: number) => void;
}

interface UseServiceJobSSEReturn {
  processingState: ProcessingState | null;
  isConnected: boolean;
  connectionError: string | null;
  connect: (jobId: string) => void;
  disconnect: () => void;
}

const createInitialProcessingState = (jobId: string): ProcessingState => ({
  jobId,
  stage: ProcessingStage.Queued,
  stageLabel: "Queued for processing...",
  progress: 0,
  error: null,
  isProcessing: true,
  isComplete: false,
  isFailed: false,
});

export function useServiceJobSSE(options: UseServiceJobSSEOptions = {}): UseServiceJobSSEReturn {
  const { getToken } = useAuth();
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const connectedJobIdRef = useRef<string | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const disconnect = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    connectedJobIdRef.current = null;
    setIsConnected(false);
  }, []);

  const connect = useCallback(async (jobId: string) => {
    if (connectedJobIdRef.current === jobId) {
      return;
    }
    
    disconnect();
    connectedJobIdRef.current = jobId;
    
    setConnectionError(null);
    setProcessingState(createInitialProcessingState(jobId));

    try {
      const token = await getToken();
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const url = `${baseUrl}/mia/service-jobs/${jobId}/status/stream`;
      
      abortControllerRef.current = new AbortController();
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "text/event-stream",
          "Cache-Control": "no-cache",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`SSE connection failed: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("SSE response has no body");
      }

      setIsConnected(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const processData = (eventType: SSEEventType, data: string) => {
        try {
          const parsed = JSON.parse(data);
          
          switch (eventType) {
            case "connected":
              break;
              
            case "stage_update":
              setProcessingState(prev => prev ? {
                ...prev,
                stage: parsed.stage as ProcessingStage,
                stageLabel: parsed.stage_label,
                progress: parsed.progress,
                error: parsed.error ?? prev.error,
                isProcessing: parsed.stage !== ProcessingStage.Completed && parsed.stage !== ProcessingStage.Failed,
                isComplete: parsed.stage === ProcessingStage.Completed,
                isFailed: parsed.stage === ProcessingStage.Failed,
              } : null);
              optionsRef.current.onStageUpdate?.(jobId, parsed.stage, parsed.progress);
              break;
              
            case "completed":
              setProcessingState(prev => prev ? {
                ...prev,
                stage: ProcessingStage.Completed,
                stageLabel: "Plan ready!",
                progress: 100,
                isProcessing: false,
                isComplete: true,
                isFailed: false,
              } : null);
              optionsRef.current.onComplete?.(jobId);
              disconnect();
              break;
              
            case "error":
              setProcessingState(prev => prev ? {
                ...prev,
                stage: ProcessingStage.Failed,
                stageLabel: "Processing failed",
                progress: 0,
                error: parsed.error || "Processing failed",
                isProcessing: false,
                isComplete: false,
                isFailed: true,
              } : null);
              optionsRef.current.onError?.(jobId, parsed.error || "Processing failed");
              disconnect();
              break;
              
            case "close":
              disconnect();
              break;
          }
        } catch (e) {
          console.error("[SSE] Failed to parse event data:", e);
        }
      };

      let currentEventType: SSEEventType | null = null;

      const readStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              disconnect();
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmedLine = line.trim();
              
              if (!trimmedLine) continue;
              
              if (trimmedLine.startsWith("event:")) {
                currentEventType = trimmedLine.replace("event:", "").trim() as SSEEventType;
              }
              else if (trimmedLine.startsWith("data:") && currentEventType) {
                const data = trimmedLine.replace("data:", "").trim();
                processData(currentEventType, data);
                currentEventType = null;
              }
              else if (trimmedLine.startsWith(":")) {
              }
            }
          }
        } catch (err) {
          if ((err as Error).name === "AbortError") {
            return;
          }
          console.error("[SSE] Stream read error:", err);
          setConnectionError((err as Error).message);
          disconnect();
        }
      };

      readStream();
      
    } catch (err) {
      const errorMessage = (err as Error).message || "Failed to connect to SSE";
      console.error("[SSE] Connection error:", errorMessage);
      setConnectionError(errorMessage);
      setProcessingState(prev => prev ? {
        ...prev,
        stage: ProcessingStage.Failed,
        stageLabel: "Connection failed",
        error: errorMessage,
        isProcessing: false,
        isFailed: true,
      } : null);
      setIsConnected(false);
    }
  }, [disconnect, getToken]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    processingState,
    isConnected,
    connectionError,
    connect,
    disconnect,
  };
}