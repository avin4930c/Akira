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
        "bg-[#111111] rounded-xl border border-border/10 p-6 space-y-5 relative overflow-hidden",
        isComplete && "border-[#27C93F]/20",
        isFailed && "border-[#FF5F56]/20",
        className
      )}
    >
      {!isComplete && !isFailed && (
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
              <div className="w-32 h-32 bg-accent/20 rounded-full blur-[40px] transform translate-x-10 -translate-y-10" />
          </div>
      )}

      <div className="relative z-10 flex items-center gap-4">
        <div
          className={cn(
            "p-3 rounded-xl border flex items-center justify-center",
            isComplete ? "bg-[#27C93F]/10 border-[#27C93F]/20" :
            isFailed ? "bg-[#FF5F56]/10 border-[#FF5F56]/20" :
            "bg-[#161616] border-border/20 shadow-sm"
          )}
        >
          <StageIcon
            className={cn(
              "h-5 w-5",
              isComplete && "text-[#27C93F]",
              isFailed && "text-[#FF5F56]",
              !isComplete && !isFailed && "text-accent",
              !isComplete && !isFailed && stageConfig.animationClass
            )}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-zinc-100 tracking-tight">
            {isComplete
              ? "Synthesis Complete"
              : isFailed
              ? "Execution Failed"
              : "MIA is analyzing your request..."}
          </h3>
          <p className="text-[13px] text-zinc-400 font-mono mt-0.5 tracking-wide">&gt; {stageLabel}</p>
        </div>
        <div className="flex flex-col items-end">
            <span
              className={cn(
                "text-2xl font-bold font-mono tracking-tighter",
                isComplete && "text-[#27C93F]",
                isFailed && "text-[#FF5F56]",
                !isComplete && !isFailed && "text-accent"
              )}
            >
              {progress}%
            </span>
        </div>
      </div>

      <Progress
        value={progress}
        className={cn(
          "h-2 bg-[#1a1a1a] border border-border/5",
          isComplete && "[&>div]:bg-[#27C93F]",
          isFailed && "[&>div]:bg-[#FF5F56]",
          !isComplete && !isFailed && "[&>div]:bg-accent"
        )}
      />

      <div className="grid grid-cols-6 gap-2">
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
                  "text-center transition-all duration-500",
                  isCurrentOrPast ? "opacity-100" : "opacity-40"
                )}
              >
                <div
                  className={cn(
                    "h-1 rounded-full mb-2 transition-all duration-500",
                    isCurrentOrPast ? "bg-accent shadow-[0_0_8px_hsl(24_100%_58%/0.5)]" : "bg-border/20",
                    isComplete && isCurrentOrPast && "bg-[#27C93F] shadow-[0_0_8px_rgba(39,201,63,0.5)]",
                    isCurrent && "animate-pulse"
                  )}
                />
                <span className={cn(
                    "text-[9px] uppercase tracking-wider font-semibold block",
                    isCurrentOrPast ? "text-zinc-300" : "text-muted-foreground"
                )}>
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
