import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ServiceJobStatusBadge, ServiceJobStatusLocal } from "./ServiceJobStatusBadge";

export interface ServiceJobRow {
    id: string;
    jobId: string;
    customer: string;
    vehicle: string;
    status: ServiceJobStatusLocal;
    lastUpdated: string;
}

export function ServiceJobsTable({ jobs, onView }: { jobs: ServiceJobRow[]; onView: (id: string) => void }) {
    return (
        <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-border/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Job ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Vehicle</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Updated</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job, idx) => (
                            <motion.tr
                                key={job.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                                onClick={() => onView(job.id)}
                            >
                                <td className="px-6 py-4 font-mono font-medium">{job.jobId}</td>
                                <td className="px-6 py-4">{job.customer}</td>
                                <td className="px-6 py-4 text-muted-foreground">{job.vehicle}</td>
                                <td className="px-6 py-4">
                                    <ServiceJobStatusBadge status={job.status} />
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {new Date(job.lastUpdated).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-primary/30 hover:bg-primary/10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onView(job.id);
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}