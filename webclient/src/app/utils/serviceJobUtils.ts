import type { ServiceJobStatus, ServiceJobPriorityLevel } from "@/types/mia";

export const statusClasses: Record<ServiceJobStatus, string> = {
    pending: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    "in-progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    validated: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
};

export const priorityConfig: Record<ServiceJobPriorityLevel, { color: string; icon: string }> = {
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

export function formatEstimatedTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
}

export function capitalizeStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
}