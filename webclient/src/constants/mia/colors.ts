import type { TaskDifficultyLevel, PartPriority, TaskCategory, ServiceJobStatus, ServiceJobPriorityLevel } from "@/types/mia";

export const difficultyColors: Record<TaskDifficultyLevel, string> = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

export const taskCategoryColors: Record<TaskCategory, string> = {
    inspection: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    repair: "bg-red-500/20 text-red-400 border-red-500/30",
    replacement: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    adjustment: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    cleaning: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

export const partPriorityColors: Record<PartPriority, string> = {
    required: "bg-red-500/20 text-red-400 border-red-500/30",
    recommended: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    optional: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export const partCategoryColors: Record<string, string> = {
    brake: "bg-red-500/10 text-red-300 border-red-500/20",
    chain: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    engine: "bg-orange-500/10 text-orange-300 border-orange-500/20",
    electrical: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
    fluids: "bg-blue-500/10 text-blue-300 border-blue-500/20",
};

export const serviceJobStatusColors: Record<ServiceJobStatus, string> = {
    pending: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    "in-progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    validated: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    failed: "bg-red-500/10 text-red-500 border-red-500/20",
};

export const priorityColors: Record<ServiceJobPriorityLevel, { color: string; icon: string }> = {
    low: {
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        icon: "●",
    },
    medium: {
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        icon: "●●",
    },
    high: {
        color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        icon: "●●●",
    },
    critical: {
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        icon: "●●●●",
    },
};