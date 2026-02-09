import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ServiceJobStatusBadge } from "../components/ServiceJobStatusBadge";
import { ServiceJobList } from "@/types/mia";

export function ServiceJobsTable({ jobs, onView }: { jobs: ServiceJobList[]; onView: (id: string) => void }) {
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
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Created</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job, idx) => (
                            <motion.tr
                                key={job.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                                onClick={() => onView(job.id)}
                            >
                                <td className="px-6 py-4 font-mono text-sm">{job.id.slice(0, 8).toUpperCase()}</td>
                                <td className="px-6 py-4 font-medium">{job.customer?.name ?? "Unknown"}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{job.vehicle?.year} {job.vehicle?.make} {job.vehicle?.model}</span>
                                        <span className="text-xs text-muted-foreground">{job.vehicle?.registration}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <ServiceJobStatusBadge status={job.status} />
                                </td>
                                <td className="px-6 py-4 text-muted-foreground text-sm">
                                    {new Date(job.created_at).toLocaleDateString()}
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
                                        View
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