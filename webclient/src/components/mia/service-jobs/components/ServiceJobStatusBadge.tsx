import { capitalizeStatus, statusClasses } from "@/app/utils/serviceJobUtils";
import { Badge } from "@/components/ui/badge";
import { ServiceJobStatus } from "@/types/mia";

export function ServiceJobStatusBadge({ status }: { status: ServiceJobStatus }) {
    return (
        <Badge variant="outline" className={statusClasses[status]}>
            {capitalizeStatus(status)}
        </Badge>
    );
}