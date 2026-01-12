import { Package, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SuggestedPart } from "@/types/mia";
import { partCategoryColors, partPriorityColors } from "@/app/utils/miaValidationUtils";

export function SuggestedPartsSection({ parts }: { parts: SuggestedPart[] }) {
    return (
        <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-xl font-bold">Suggested Parts</h3>
            </div>

            <div className="space-y-3">
                {parts.map((part, idx) => (
                    <div
                        key={idx}
                        className="p-4 rounded-lg bg-secondary/30 border border-border/50"
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
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className="text-sm font-semibold text-muted-foreground">
                                    Qty: {part.quantity}
                                </div>
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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}