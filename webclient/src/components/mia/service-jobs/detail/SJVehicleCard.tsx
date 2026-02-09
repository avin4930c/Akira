"use client";

import { useRouter } from "next/navigation";

interface SJVehicleCardProps {
    vehicleId?: string;
    title: string;
    registration: string;
    mileage: number | string;
}

export function SJVehicleCard({ vehicleId, title, registration, mileage }: SJVehicleCardProps) {
    const router = useRouter();

    const handleClick = () => {
        if (vehicleId) {
            router.push(`/mia/vehicles/${vehicleId}`);
        }
    };

    return (
        <div 
            className={`glass-card p-6 rounded-xl ${vehicleId ? 'cursor-pointer hover:bg-secondary/30 transition-colors' : ''}`}
            onClick={handleClick}
        >
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">VEHICLE</h3>
            <div className="space-y-2">
                <div className="text-lg font-bold">{title}</div>
                <div className="text-sm text-muted-foreground">Registration: {registration}</div>
                <div className="text-sm text-muted-foreground">Mileage: {mileage}</div>
            </div>
        </div>
    );
}