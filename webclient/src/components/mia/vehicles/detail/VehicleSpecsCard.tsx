import { Car, Calendar, Gauge } from "lucide-react";

interface VehicleSpecsCardProps {
    make: string;
    model: string;
    year: number;
    registration: string;
    mileage: number;
    engine_type: string;
    last_service_date?: string;
}

export function VehicleSpecsCard({ make, model, year, registration, mileage, engine_type, last_service_date }: VehicleSpecsCardProps) {
    return (
        <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                    <Car className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Vehicle Specifications</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-muted-foreground">Make</div>
                    <div className="font-medium mt-1">{make}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">Model</div>
                    <div className="font-medium mt-1">{model}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">Year</div>
                    <div className="font-medium mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        {year}
                    </div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">Registration</div>
                    <div className="font-medium font-mono mt-1">{registration}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">Mileage</div>
                    <div className="font-medium mt-1 flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-primary" />
                        {mileage.toLocaleString()} km
                    </div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">Engine Type</div>
                    <div className="font-medium mt-1">{engine_type}</div>
                </div>
                <div className="col-span-2">
                    <div className="text-sm text-muted-foreground">Last Service Date</div>
                    <div className="font-medium mt-1">
                        {last_service_date ? new Date(last_service_date).toLocaleDateString() : "N/A"}
                    </div>
                </div>
            </div>
        </div>
    );
}