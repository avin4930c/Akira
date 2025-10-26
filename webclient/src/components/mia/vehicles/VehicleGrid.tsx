import { motion } from "framer-motion";
import { VehicleCard } from "./VehicleCard";

interface VehicleGridProps {
    vehicles: Array<{
        id: string;
        make: string;
        model: string;
        year: number;
        registration: string;
        mileage: number;
        last_service_date: string;
    }>;
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle, idx) => (
                <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                >
                    <VehicleCard vehicle={vehicle} />
                </motion.div>
            ))}
        </div>
    );
}