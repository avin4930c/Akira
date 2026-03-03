import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ServiceJobStatusBadge } from "../components/ServiceJobStatusBadge";
import { ServiceJobList } from "@/types/mia";

export function ServiceJobsTable({ jobs, onView }: { jobs: ServiceJobList[]; onView: (id: string) => void }) {
    return (
        <div className="bg-[#111111] border border-border/10 rounded-xl overflow-hidden shadow-xl shadow-black/20">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#0a0a0a] border-b border-border/10">
                        <tr>
                            <th className="px-6 py-4 text-left text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Job ID</th>
                            <th className="px-6 py-4 text-left text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Customer</th>
                            <th className="px-6 py-4 text-left text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Vehicle</th>
                            <th className="px-6 py-4 text-left text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Status</th>
                            <th className="px-6 py-4 text-left text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Created</th>
                            <th className="px-6 py-4 text-left text-[12px] uppercase tracking-wider text-muted-foreground font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                        {jobs.map((job, idx) => (
                            <motion.tr
                                key={job.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="hover:bg-[#161616] transition-colors cursor-pointer group"
                                onClick={() => onView(job.id)}
                            >
                                <td className="px-6 py-4 font-mono text-[13px] text-muted-foreground group-hover:text-foreground transition-colors">{job.id.slice(0, 8).toUpperCase()}</td>
                                <td className="px-6 py-4 font-medium text-[14px] text-foreground/90">{job.customer?.name ?? "Unknown"}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-[14px] text-foreground/90">{job.vehicle?.year} {job.vehicle?.make} {job.vehicle?.model}</span>
                                        <span className="text-[12px] text-muted-foreground font-mono mt-0.5">{job.vehicle?.registration}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <ServiceJobStatusBadge status={job.status} />
                                </td>
                                <td className="px-6 py-4 text-muted-foreground text-[13px]">
                                    {new Date(job.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}
                                </td>
                                <td className="px-6 py-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-[12px] border-border/10 bg-[#1a1a1a] group-hover:border-accent/40 group-hover:text-accent group-hover:bg-accent/10 transition-colors shadow-none"
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