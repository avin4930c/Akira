"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Car } from "lucide-react";
import { useMiaStore } from "@/stores/mia-data-store";
import EmptyState from "@/components/mia/common/EmptyState";
import { VehicleDetailHeader } from "@/components/mia/vehicles/VehicleDetailHeader";
import { VehicleSpecsCard } from "@/components/mia/vehicles/VehicleSpecsCard";
import { VehicleServiceHistory } from "@/components/mia/vehicles/VehicleServiceHistory";
import { OwnerInfoCard } from "@/components/mia/vehicles/OwnerInfoCard";
import { VehicleDetailQuickActions } from "@/components/mia/vehicles/VehicleDetailQuickActions";

export default function VehicleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const vehicleId = params?.vehicleId as string;
    const { getVehicleById, getCustomerById, serviceJobs } = useMiaStore();

    const vehicle = getVehicleById(vehicleId || "");
    const customer = vehicle ? getCustomerById(vehicle.customer_id) : undefined;
    const vehicleJobs = serviceJobs.filter((job) => job.vehicle_id === vehicleId);

    if (!vehicle || !customer) {
        return (
            <EmptyState
                icon={Car}
                title="Vehicle not found"
                description="The vehicle you're looking for doesn't exist."
                actionLabel="Back to Vehicles"
                onAction={() => router.push("/mia/vehicles")}
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <VehicleDetailHeader
                title={`${vehicle.make} ${vehicle.model}`}
                subtitle="Vehicle Details"
                backHref="/mia/vehicles"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <VehicleSpecsCard
                        make={vehicle.make}
                        model={vehicle.model}
                        year={vehicle.year}
                        registration={vehicle.registration}
                        mileage={vehicle.mileage}
                        engine_type={vehicle.engine_type}
                        last_service_date={vehicle.last_service_date}
                    />

                    <VehicleServiceHistory jobs={vehicleJobs} />
                </div>

                <div className="space-y-6">
                    <OwnerInfoCard
                        name={customer.name}
                        phone={customer.phone}
                        email={customer.email}
                        userId={customer.id}
                    />
                    <VehicleDetailQuickActions />
                </div>
            </div>
        </motion.div>
    );
}