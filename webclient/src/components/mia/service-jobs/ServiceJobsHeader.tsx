import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ServiceJobsHeader({ onNew }: { onNew: () => void }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Service Jobs</h1>
                <p className="text-muted-foreground mt-1">Track and manage all service jobs</p>
            </div>
            <Button onClick={onNew} className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Start New Job
            </Button>
        </div>
    );
}