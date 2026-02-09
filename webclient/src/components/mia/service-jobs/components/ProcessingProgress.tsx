"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ProcessingState } from "@/types/sse";
import { ProcessingStage } from "@/types/mia";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { processingStageConfig } from "@/constants/mia/processing";

interface ProcessingProgressProps {
  state: ProcessingState | null;
  className?: string;
  compact?: boolean;
}

export function ProcessingProgress({ state, className, compact = false }: ProcessingProgressProps) {
  if (!state) return null;

  const { stage, stageLabel, progress, error, isComplete, isFailed } = state;
  const stageConfig = processingStageConfig[stage];
  const StageIcon = stageConfig.icon;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <StageIcon className={cn("h-5 w-5", stageConfig.animationClass)} />
        <div className="flex-1 min-w-0">
          <Progress value={progress} className="h-2" />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {progress}%
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border p-6 space-y-4",
        isComplete && "border-green-500/30 bg-green-500/5",
        isFailed && "border-red-500/30 bg-red-500/5",
        !isComplete && !isFailed && "border-primary/30 bg-primary/5",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "p-2 rounded-lg",
            isComplete && "bg-green-500/10",
            isFailed && "bg-red-500/10",
            !isComplete && !isFailed && "bg-primary/10"
          )}
        >
          <StageIcon
            className={cn(
              "h-5 w-5",
              isComplete && "text-green-500",
              isFailed && "text-red-500",
              stageConfig.animationClass
            )}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">
            {isComplete
              ? "Processing Complete"
              : isFailed
              ? "Processing Failed"
              : "MIA is Analyzing..."}
          </h3>
          <p className="text-sm text-muted-foreground">{stageLabel}</p>
        </div>
        <span
          className={cn(
            "text-lg font-bold",
            isComplete && "text-green-500",
            isFailed && "text-red-500",
            !isComplete && !isFailed && "text-primary"
          )}
        >
          {progress}%
        </span>
      </div>

      <Progress
        value={progress}
        className={cn(
          "h-3",
          isComplete && "[&>div]:bg-green-500",
          isFailed && "[&>div]:bg-red-500"
        )}
      />

      <div className="grid grid-cols-6 gap-1">
        {Object.entries(processingStageConfig)
          .filter(([key]) => key !== ProcessingStage.Failed)
          .map(([stageKey, config]) => {
            const stageValue = stageKey as ProcessingStage;
            const isCurrentOrPast = config.progress <= progress;
            const isCurrent = stageValue === stage;

            return (
              <div
                key={stageKey}
                className={cn(
                  "text-center transition-colors",
                  isCurrentOrPast ? "text-primary" : "text-muted-foreground/50"
                )}
              >
                <div
                  className={cn(
                    "h-1.5 rounded-full mb-1 transition-colors",
                    isCurrentOrPast ? "bg-primary" : "bg-muted",
                    isCurrent && "animate-pulse"
                  )}
                />
                <span className="text-[10px] leading-tight block">
                  {config.label}
                </span>
              </div>
            );
          })}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-red-500 bg-red-500/10 rounded-lg p-3"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
