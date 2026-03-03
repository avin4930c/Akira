import { Clock, AlertTriangle, FileText, CalendarClock } from "lucide-react";
import type { JobSummaryProps } from "@/types/mia";
import { formatEstimatedTime } from "@/utils/mia/formatters";
import { cn } from "@/lib/utils";

const priorityConfig: Record<string, { label: string, colorClass: string }> = {
    critical: { label: "CRITICAL", colorClass: "text-[#FF5F56] border-[#FF5F56]/20 bg-[#FF5F56]/10" },
    high: { label: "HIGH", colorClass: "text-[#FFBD2E] border-[#FFBD2E]/20 bg-[#FFBD2E]/10" },
    medium: { label: "MEDIUM", colorClass: "text-[#27C93F] border-[#27C93F]/20 bg-[#27C93F]/10" },
    low: { label: "LOW", colorClass: "text-muted-foreground border-border/20 bg-border/5" },
};

export function JobSummaryFooter({
    estimatedTotalMinutes,
    priorityLevel,
    warrantyNotes,
    followUpRecommendations,
}: JobSummaryProps) {
    const timeString = formatEstimatedTime(estimatedTotalMinutes);
    const pConfig = priorityConfig[priorityLevel?.toLowerCase()] || priorityConfig.medium;

    return (
        <div className="space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#111111] border border-border/10 rounded-xl p-5 flex items-center justify-between group hover:border-accent/30 transition-colors">
                    <div className="flex flex-col gap-1">
                        <span className="text-[12px] font-mono text-muted-foreground/80 uppercase tracking-widest">Est. Labor Time</span>
                        <span className="text-xl font-semibold tracking-tight text-foreground/90">{timeString}</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#161616] border border-border/10 flex items-center justify-center group-hover:bg-accent/5 transition-colors">
                        <Clock className="w-4 h-4 text-accent" />
                    </div>
                </div>

                <div className="bg-[#111111] border border-border/10 rounded-xl p-5 flex items-center justify-between group hover:border-accent/30 transition-colors">
                    <div className="flex flex-col gap-2">
                        <span className="text-[12px] font-mono text-muted-foreground/80 uppercase tracking-widest">Job Priority</span>
                        <span className={cn("text-[11px] px-2 py-0.5 rounded font-medium border w-fit", pConfig.colorClass)}>
                            {pConfig.label}
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#161616] border border-border/10 flex items-center justify-center group-hover:bg-[#FF5F56]/5 transition-colors">
                        <AlertTriangle className={cn("w-4 h-4", priorityLevel.toLowerCase() === 'critical' ? 'text-[#FF5F56]' : 'text-muted-foreground')} />
                    </div>
                </div>
            </div>

            {warrantyNotes && (
                <div className="bg-[#111111] border border-border/10 rounded-xl p-6 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-4 h-4 text-accent" />
                        <h3 className="text-[14px] font-medium text-foreground/90">Warranty Notes</h3>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed pl-7">
                        {warrantyNotes}
                    </p>
                </div>
            )}

            {followUpRecommendations && (
                <div className="bg-[#111111] border border-border/10 rounded-xl p-6 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-3">
                        <CalendarClock className="w-4 h-4 text-accent" />
                        <h3 className="text-[14px] font-medium text-foreground/90">Follow-up Recommendations</h3>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed pl-7">
                        {followUpRecommendations}
                    </p>
                </div>
            )}
        </div>
    );
}