import { AlertCircle, CheckCircle2, XCircle, Info, Layers } from "lucide-react";
import type { SuggestedPart, PartAvailabilityResult } from "@/types/mia";
import { PartAvailabilityStatus } from "@/types/mia";
import { cn } from "@/lib/utils";

interface SuggestedPartsSectionProps {
    parts: SuggestedPart[];
    partsAvailability?: PartAvailabilityResult[];
}

const partPriorityColors: Record<string, string> = {
    "required": "bg-[#FF5F56]/10 text-[#FF5F56] border-[#FF5F56]/20",
    "recommended": "bg-[#FFBD2E]/10 text-[#FFBD2E] border-[#FFBD2E]/20",
    "optional": "bg-[#27C93F]/10 text-[#27C93F] border-[#27C93F]/20",
};

const availabilityStatusConfig: Record<PartAvailabilityStatus, { icon: typeof CheckCircle2; className: string; label: string; badgeBase: string }> = {
    [PartAvailabilityStatus.Available]: {
        icon: CheckCircle2,
        className: "text-[#27C93F]",
        label: "In Stock",
        badgeBase: "bg-[#27C93F]/10 text-[#27C93F] border-[#27C93F]/20"
    },
    [PartAvailabilityStatus.Partial]: {
        icon: Info,
        className: "text-[#FFBD2E]",
        label: "Low Stock",
        badgeBase: "bg-[#FFBD2E]/10 text-[#FFBD2E] border-[#FFBD2E]/20"
    },
    [PartAvailabilityStatus.Unavailable]: {
        icon: XCircle,
        className: "text-[#FF5F56]",
        label: "Out of Stock",
        badgeBase: "bg-[#FF5F56]/10 text-[#FF5F56] border-[#FF5F56]/20"
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
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#161616] border border-border/20 shadow-sm relative overflow-hidden">
                        <Layers className="w-4 h-4 text-accent" />
                        <div className="absolute inset-0 bg-accent/10 blur-[10px]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold tracking-tight text-foreground/90">Semantic Inventory</h3>
                        <p className="text-[13px] text-muted-foreground">Required and suggested components</p>
                    </div>
                </div>
                {partsAvailability && (
                    <div className="text-right flex flex-col items-end">
                        <div className="text-[11px] font-mono text-muted-foreground/80 mb-1 tracking-wider uppercase">Est. Parts Cost</div>
                        <div className="text-[15px] font-medium text-foreground tracking-tight flex items-center gap-2">
                            ₹{totalCost.toLocaleString()}
                            {unavailableCount > 0 && (
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FF5F56]/10 text-[#FF5F56] border border-[#FF5F56]/20 font-medium">
                                    {unavailableCount} Unavailable
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {parts.map((part, idx) => {
                    const availability = availabilityMap.get(part.name);
                    const statusConfig = availability 
                        ? availabilityStatusConfig[availability.availability_status]
                        : null;

                    return (
                        <div
                            key={idx}
                            className={cn(
                                "flex flex-col md:flex-row bg-[#111111] border border-border/10 rounded-xl overflow-hidden hover:border-accent/30 transition-colors group relative",
                                availability?.availability_status === PartAvailabilityStatus.Unavailable && "border-[#FF5F56]/30 hover:border-[#FF5F56]/50"
                            )}
                        >
                            <div className={cn(
                                "absolute left-0 top-0 bottom-0 w-[3px] bg-border/20 group-hover:bg-accent/50 transition-colors",
                                availability?.availability_status === PartAvailabilityStatus.Unavailable && "bg-[#FF5F56]/50"
                            )} />

                            <div className="flex-1 p-5 pl-7 border-b md:border-b-0 md:border-r border-border/10">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <h4 className="font-medium text-[15px] sm:text-base text-foreground/90">{part.name}</h4>
                                            {part.priority === "required" && (
                                                <AlertCircle className="w-4 h-4 text-[#FF5F56]" />
                                            )}
                                        </div>
                                        <p className="text-[14px] text-zinc-300 leading-relaxed">{part.description}</p>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 shrink-0 items-end">
                                        <span className={cn(
                                            "text-[12px] px-2 py-0.5 rounded-md border text-center font-medium",
                                            partPriorityColors[part.priority] || "bg-border/5 text-muted-foreground border-border/10"
                                        )}>
                                            {part.priority}
                                        </span>
                                        {part.category && (
                                            <span className="text-[12px] px-2 py-0.5 rounded-md font-mono bg-border/5 text-muted-foreground border border-border/10">
                                                {part.category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {availability?.matched_inventory_part && (
                                    <div className="flex items-center justify-between text-[14px] p-3 mt-3 bg-[#161616] rounded-md border border-border/10">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-zinc-200 font-medium">{availability.matched_inventory_part.name}</span>
                                            <span className="text-muted-foreground font-mono text-[12px] sm:text-[13px]">SKU: {availability.matched_inventory_part.part_code}</span>
                                        </div>
                                        {statusConfig && (
                                            <span className={cn("text-[12px] px-2.5 py-1 rounded font-medium border", statusConfig.badgeBase)}>
                                                {statusConfig.label} ({availability.matched_inventory_part.stock_quantity || 0})
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="w-full md:w-48 bg-[#0d0d0d] p-5 flex flex-col justify-center gap-3">
                                <div className="flex justify-between items-center md:flex-col md:items-start md:gap-1">
                                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Quantity</span>
                                    <span className="font-mono text-[14px] text-foreground/80">{part.quantity}x</span>
                                </div>
                                
                                {availability?.unit_price && (
                                    <div className="flex justify-between items-center md:flex-col md:items-start md:gap-1">
                                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Unit Price</span>
                                        <span className="font-medium text-[14px] text-foreground">₹{availability.unit_price.toLocaleString()}</span>
                                    </div>
                                )}

                                {availability && (
                                    <div className="flex justify-between items-center md:flex-col md:items-start md:gap-1 border-t border-border/10 pt-2 mt-1">
                                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Match Score</span>
                                        <span className={cn(
                                            "text-[12px] font-mono",
                                            availability.match_confidence >= 0.8 ? "text-[#27C93F]" :
                                            availability.match_confidence >= 0.5 ? "text-[#FFBD2E]" : "text-[#FF5F56]"
                                        )}>
                                            {(availability.match_confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}