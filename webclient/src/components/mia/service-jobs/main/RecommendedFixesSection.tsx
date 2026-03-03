import { CheckCircle2 } from "lucide-react";
import type { RecommendedFix } from "@/types/mia";

export function RecommendedFixesSection({ items }: { items: RecommendedFix[] }) {
    return (
        <div className="bg-[#111111] border border-border/10 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Recommended Fixes</h3>
            </div>
            <ul className="space-y-3">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">{idx + 1}</span>
                        </div>
                        <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}