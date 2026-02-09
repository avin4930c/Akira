import { Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MechanicTip } from "@/types/mia";
import { tipCategoryConfig } from "@/constants/mia/icons";

export function TipsSection({ tips }: { tips: MechanicTip[] }) {
    return (
        <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold">Pro Tips</h3>
            </div>

            <div className="space-y-3">
                {tips.map((tip, idx) => {
                    const config = tipCategoryConfig[tip.category];
                    const Icon = config.icon;

                    return (
                        <div
                            key={idx}
                            className={`p-4 rounded-lg ${config.bgColor} border ${config.borderColor}`}
                        >
                            <div className="flex items-start gap-3">
                                <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className={config.badgeColor}>
                                            {tip.category}
                                        </Badge>
                                    </div>
                                    <p className="text-sm leading-relaxed">{tip.tip}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}