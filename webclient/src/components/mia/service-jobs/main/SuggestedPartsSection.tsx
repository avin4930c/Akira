import { Package, AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SuggestedPart, PartAvailabilityResult } from "@/types/mia";
import { PartAvailabilityStatus } from "@/types/mia";
import { cn } from "@/lib/utils";
import { partCategoryColors, partPriorityColors } from "@/constants/mia/colors";

interface SuggestedPartsSectionProps {
    parts: SuggestedPart[];
    partsAvailability?: PartAvailabilityResult[];
}

const availabilityStatusConfig: Record<PartAvailabilityStatus, { icon: typeof CheckCircle2; className: string; label: string }> = {
    [PartAvailabilityStatus.Available]: {
        icon: CheckCircle2,
        className: "text-green-500",
        label: "In Stock",
    },
    [PartAvailabilityStatus.Partial]: {
        icon: Info,
        className: "text-yellow-500",
        label: "Partial",
    },
    [PartAvailabilityStatus.Unavailable]: {
        icon: XCircle,
        className: "text-red-500",
        label: "Out of Stock",
    },
};

export function SuggestedPartsSection({ parts, partsAvailability }: SuggestedPartsSectionProps) {
    const availabilityMap = new Map<string, PartAvailabilityResult>();
    partsAvailability?.forEach((pa) => {
        availabilityMap.set(pa.suggested_part.name, pa);
    });

    const totalCost = partsAvailability?.reduce((sum, pa) => sum + (pa.total_price || 0), 0) || 0;
    const unavailableCount = partsAvailability?.filter((pa) => pa.availability_status === PartAvailabilityStatus.Unavailable).length || 0;

    return (
        <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <Package className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold">Suggested Parts</h3>
                </div>
                {partsAvailability && (
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Estimated Cost</div>
                        <div className="text-lg font-bold text-green-400">
                            ₹{totalCost.toLocaleString()}
                        </div>
                        {unavailableCount > 0 && (
                            <div className="text-xs text-red-400">
                                {unavailableCount} part{unavailableCount > 1 ? "s" : ""} unavailable
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {parts.map((part, idx) => {
                    const availability = availabilityMap.get(part.name);
                    const statusConfig = availability 
                        ? availabilityStatusConfig[availability.availability_status]
                        : null;
                    const StatusIcon = statusConfig?.icon;

                    return (
                        <div
                            key={idx}
                            className={cn(
                                "p-4 rounded-lg bg-secondary/30 border border-border/50",
                                availability?.availability_status === PartAvailabilityStatus.Unavailable && "border-red-500/30"
                            )}
                        >
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold">{part.name}</h4>
                                        {part.priority === "required" && (
                                            <AlertCircle className="w-4 h-4 text-red-400" />
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{part.description}</p>
                                    
                                    {availability?.matched_inventory_part && (
                                        <div className="mt-2 text-xs text-muted-foreground bg-secondary/50 rounded p-2">
                                            <span className="font-medium">Matched: </span>
                                            {availability.matched_inventory_part.name}
                                            <span className="text-primary ml-2">
                                                ({availability.matched_inventory_part.part_code})
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="text-sm font-semibold text-muted-foreground">
                                        Qty: {part.quantity}
                                    </div>
                                    {availability?.unit_price && (
                                        <div className="text-sm font-medium text-green-400">
                                            ₹{availability.unit_price.toLocaleString()}
                                        </div>
                                    )}
                                    {statusConfig && StatusIcon && (
                                        <div className={cn("flex items-center gap-1 justify-end mt-1", statusConfig.className)}>
                                            <StatusIcon className="w-3 h-3" />
                                            <span className="text-xs">{statusConfig.label}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className={partPriorityColors[part.priority]}>
                                    {part.priority}
                                </Badge>
                                {part.category && (
                                    <Badge variant="outline" className={partCategoryColors[part.category] || "bg-gray-500/10 text-gray-300 border-gray-500/20"}>
                                        {part.category}
                                    </Badge>
                                )}
                                {availability && (
                                    <Badge 
                                        variant="outline" 
                                        className={cn(
                                            "text-xs",
                                            availability.match_confidence >= 0.8 && "bg-green-500/10 text-green-300 border-green-500/20",
                                            availability.match_confidence >= 0.5 && availability.match_confidence < 0.8 && "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
                                            availability.match_confidence < 0.5 && "bg-red-500/10 text-red-300 border-red-500/20"
                                        )}
                                    >
                                        {Math.round(availability.match_confidence * 100)}% match
                                    </Badge>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}