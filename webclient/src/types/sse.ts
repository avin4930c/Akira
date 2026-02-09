import { ProcessingStage } from "./mia";

export type SSEEventType = "connected" | "stage_update" | "completed" | "error" | "close";

interface SSEBaseEvent {
  event_id: string;
  timestamp: string;
}

interface SSEStageData {
  stage: ProcessingStage;
  stage_label: string;
  progress: number;
  error?: string | null;
}

export type SSEConnectedEvent = SSEBaseEvent & { type: "connected" };
export type SSEStageUpdateEvent = SSEBaseEvent & SSEStageData & { type: "stage_update" };
export type SSECompletedEvent = SSEBaseEvent & SSEStageData & { type: "completed" };
export type SSEErrorEvent = SSEBaseEvent & SSEStageData & { type: "error"; error: string };
export type SSECloseEvent = { type: "close"; event_id: string };

export type SSEEvent =
  | SSEConnectedEvent
  | SSEStageUpdateEvent
  | SSECompletedEvent
  | SSEErrorEvent
  | SSECloseEvent;

export interface ProcessingState {
  jobId: string;
  stage: ProcessingStage;
  stageLabel: string;
  progress: number;
  error?: string | null;
  isProcessing: boolean;
  isComplete: boolean;
  isFailed: boolean;
}