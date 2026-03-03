import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ServiceJobsHeader({ onNew }: { onNew: () => void }) {
    return (
        <div className="flex items-center justify-between pb-4 border-b border-border/10 mb-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground/90">Service Pipeline</h1>
                <p className="text-[14px] text-muted-foreground mt-1">Manage and execute active diagnostic jobs</p>
            </div>
            <Button onClick={onNew} className="bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent font-medium shadow-none">
                <Plus className="w-4 h-4 mr-2" />
                Initialize Job
            </Button>
        </div>
    );
}