import { Badge } from "@/components/ui/badge";
import { serviceJobStatusColors } from "@/constants/mia/colors";
import { ServiceJobStatus } from "@/types/mia";
import { capitalizeStatus } from "@/utils/mia/formatters";

export function ServiceJobStatusBadge({ status }: { status: ServiceJobStatus }) {
    return (
        <Badge variant="outline" className={serviceJobStatusColors[status]}>
            {capitalizeStatus(status)}
        </Badge>
    );
}