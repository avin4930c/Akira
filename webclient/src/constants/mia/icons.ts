import { Shield, Sparkles, Zap, Lightbulb, type LucideIcon } from "lucide-react";
import type { TipCategory } from "@/types/mia";

export interface TipCategoryConfig {
    icon: LucideIcon;
    color: string;
    bgColor: string;
    borderColor: string;
    badgeColor: string;
}

export const tipCategoryConfig: Record<TipCategory, TipCategoryConfig> = {
    safety: {
        icon: Shield,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    },
    quality: {
        icon: Sparkles,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/30",
        badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
    efficiency: {
        icon: Zap,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
        badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    },
    cost_saving: {
        icon: Lightbulb,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
    },
};