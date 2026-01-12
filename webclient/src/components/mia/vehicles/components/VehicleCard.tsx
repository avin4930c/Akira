import { Button } from "@/components/ui/button";
import { Calendar, Gauge, Car as CarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface VehicleCardProps {
    vehicle: {
        id: string;
        make: string;
        model: string;
        year: number;
        registration: string;
        mileage: number;
        last_service_date?: string;
    };
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
    const router = useRouter();

    return (
        <div
            className="glass-card p-6 rounded-xl space-y-4 cursor-pointer border border-primary/20 hover:border-primary/40 transition-all"
            onClick={() => router.push(`/mia/vehicles/${vehicle.id}`)}
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold">
                        {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">ID: {vehicle.id}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                    <CarIcon className="w-6 h-6 text-primary" />
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Year: {vehicle.year}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Gauge className="w-4 h-4" />
                    <span>Mileage: {vehicle.mileage.toLocaleString()} km</span>
                </div>
            </div>

            <div className="pt-4 border-t border-border/50">
                <div className="text-xs text-muted-foreground">Registration</div>
                <div className="font-mono text-sm font-medium">{vehicle.registration}</div>
            </div>

            <div className="pt-2">
                <div className="text-xs text-muted-foreground">Last Service</div>
                <div className="text-sm font-medium">
                    {vehicle.last_service_date ? new Date(vehicle.last_service_date).toLocaleDateString() : "N/A"}
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full border-primary/30 hover:bg-primary/10"
                onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/mia/vehicles/${vehicle.id}`);
                }}
            >
                View Details
            </Button>
        </div>
    );
}
