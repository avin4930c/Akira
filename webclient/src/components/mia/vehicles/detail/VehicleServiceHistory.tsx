"use client";

import { Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ServiceJobList } from "@/types/mia";
import { ServiceJobStatusBadge } from "@/components/mia/service-jobs/components/ServiceJobStatusBadge";

interface VehicleServiceHistoryProps {
  jobs: ServiceJobList[];
}

export function VehicleServiceHistory({ jobs }: VehicleServiceHistoryProps) {
  const router = useRouter();
  return (
    <div className="bg-[#111111] border border-border/10 p-6 rounded-xl">
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
            <div 
              key={job.id} 
              className="p-4 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
              onClick={() => router.push(`/mia/service-jobs/${job.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm">{job.id.slice(0, 8).toUpperCase()}</span>
                <ServiceJobStatusBadge status={job.status} />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{job.service_info}</p>
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