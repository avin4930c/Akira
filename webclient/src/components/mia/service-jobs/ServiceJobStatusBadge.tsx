import { Badge } from "@/components/ui/badge";

export type ServiceJobStatusLocal = "draft" | "validated" | "completed";

const statusClasses: Record<ServiceJobStatusLocal, string> = {
    draft: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    validated: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
};

export function ServiceJobStatusBadge({ status }: { status: ServiceJobStatusLocal }) {
    return (
        <Badge variant="outline" className={statusClasses[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
}