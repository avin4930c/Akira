import { Lightbulb } from "lucide-react";
import type { MechanicTip } from "@/types/mia";
import { tipCategoryConfig } from "@/constants/mia/icons";
import { cn } from "@/lib/utils";

export function TipsSection({ tips }: { tips: MechanicTip[] }) {
    return (
        <div className="w-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#161616] border border-border/20 shadow-sm relative overflow-hidden">
                    <Lightbulb className="w-4 h-4 text-accent" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground/90">Mechanic Insights</h3>
                    <p className="text-[13px] text-muted-foreground">Pro-tips for better execution</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip, idx) => {
                    const config = tipCategoryConfig[tip.category];
                    const Icon = config.icon;

                    return (
                        <div
                            key={idx}
                            className="flex flex-col bg-[#111111] border border-border/10 rounded-xl p-5 hover:border-border/30 transition-colors relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Icon className={cn("w-4 h-4", config.color)} />
                                    <span className="text-[12px] font-medium text-foreground/80 tracking-wide uppercase">
                                        {tip.category.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                            <p className="text-[13px] text-muted-foreground leading-relaxed">
                                {tip.tip}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}