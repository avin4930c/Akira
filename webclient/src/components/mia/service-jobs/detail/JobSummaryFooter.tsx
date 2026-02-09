import { Clock, AlertTriangle, FileText, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { JobSummaryProps } from "@/types/mia";
import { priorityColors } from "@/constants/mia/colors";
import { formatEstimatedTime } from "@/utils/mia/formatters";

export function JobSummaryFooter({
    estimatedTotalMinutes,
    priorityLevel,
    warrantyNotes,
    followUpRecommendations,
}: JobSummaryProps) {
    const timeString = formatEstimatedTime(estimatedTotalMinutes);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Estimated Total Time</div>
                            <div className="text-2xl font-bold">{timeString}</div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Priority Level</div>
                            <Badge
                                variant="outline"
                                className={`${priorityColors[priorityLevel].color} text-base font-semibold mt-1`}
                            >
                                {priorityLevel.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {warrantyNotes && (
                <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold">Warranty Notes</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-13">
                        {warrantyNotes}
                    </p>
                </div>
            )}

            {followUpRecommendations && (
                <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                            <CalendarClock className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold">Follow-up Recommendations</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-13">
                        {followUpRecommendations}
                    </p>
                </div>
            )}
        </div>
    );
}