import { Loader2, CheckCircle2, XCircle, Sparkles, type LucideIcon } from "lucide-react";
import { ProcessingStage } from "@/types/mia";

export interface ProcessingStageConfig {
  icon: LucideIcon;
  progress: number;
  label: string;
  animationClass?: string;
}

export const processingStageConfig: Record<ProcessingStage, ProcessingStageConfig> = {
  [ProcessingStage.Queued]: {
    icon: Loader2,
    progress: 0,
    label: "Queue",
    animationClass: "animate-spin",
  },
  [ProcessingStage.FetchingVehicleData]: {
    icon: Loader2,
    progress: 20,
    label: "Vehicle",
    animationClass: "animate-spin",
  },
  [ProcessingStage.Researching]: {
    icon: Sparkles,
    progress: 40,
    label: "Research",
    animationClass: "animate-pulse",
  },
  [ProcessingStage.GeneratingPlan]: {
    icon: Sparkles,
    progress: 60,
    label: "AI Plan",
    animationClass: "animate-pulse",
  },
  [ProcessingStage.CheckingInventory]: {
    icon: Loader2,
    progress: 80,
    label: "Inventory",
    animationClass: "animate-spin",
  },
  [ProcessingStage.Completed]: {
    icon: CheckCircle2,
    progress: 100,
    label: "Done",
  },
  [ProcessingStage.Failed]: {
    icon: XCircle,
    progress: 0,
    label: "Failed",
  },
};