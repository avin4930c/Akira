import { Wrench } from "lucide-react";
import type { ServiceJob } from "@/types/mia";

export function VehicleServiceHistory({ jobs }: { jobs: ServiceJob[] }) {
  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
          <Wrench className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold">Service History</h2>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No service history yet</div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Service Job #{job.id}</span>
                <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary">{job.status}</span>
              </div>
              <p className="text-sm text-muted-foreground">{job.service_info}</p>
              <p className="text-sm text-muted-foreground/80 mt-1">Notes: {job.mechanic_notes}</p>
              <div className="text-xs text-muted-foreground mt-2">
                {new Date(job.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}