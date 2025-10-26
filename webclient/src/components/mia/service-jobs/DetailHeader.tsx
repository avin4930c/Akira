import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle2 } from "lucide-react";

export function DetailHeader({ title, jobId, status, onRevalidate, onComplete }: { title: string; jobId: string; status: "Validated" | "Draft" | "Completed"; onRevalidate: () => void; onComplete: () => void }) {
    const statusClass =
        status === "Validated"
            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
            : status === "Completed"
                ? "bg-green-500/10 text-green-500 border-green-500/20"
                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";

    return (
        <div className="flex items-start justify-between">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <Badge variant="outline" className={statusClass}>{status}</Badge>
                </div>
                <p className="text-muted-foreground mt-1">Job ID: {jobId}</p>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10" onClick={onRevalidate}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-Validate
                </Button>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90" onClick={onComplete}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Completed
                </Button>
            </div>
        </div>
    );
}