"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Car } from "lucide-react";
import EmptyState from "@/components/mia/common/EmptyState";
import { useVehicleById } from "@/hooks/vehicles/useVehicles";
import { useCustomerById } from "@/hooks/customer/useCustomer";
import { ServiceJob } from "@/types/mia";
import { VehicleDetailHeader } from "@/components/mia/vehicles/detail/VehicleDetailHeader";
import { VehicleSpecsCard } from "@/components/mia/vehicles/detail/VehicleSpecsCard";
import { VehicleServiceHistory } from "@/components/mia/vehicles/detail/VehicleServiceHistory";
import { OwnerInfoCard } from "@/components/mia/vehicles/detail/OwnerInfoCard";
import { VehicleDetailQuickActions } from "@/components/mia/vehicles/detail/VehicleDetailQuickActions";

export default function VehicleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const vehicleId = params?.vehicleId as string;
    const { data: vehicle, isLoading: vehicleLoading, error: vehicleError } = useVehicleById(vehicleId);
    const { data: customer, isLoading: customerLoading, error: customerError } = useCustomerById(vehicle?.customer_id ?? "");
    const vehicleJobs: ServiceJob[] = []; // TODO: Add proper type and fetch service jobs for the vehicle

    if (vehicleLoading) {
        return <div className="text-sm text-muted-foreground">Loading vehicle…</div>;
    }

    if (vehicleError || !vehicle) {
        return (
            <EmptyState
                icon={Car}
                title="Vehicle not found"
                description="The vehicle you're looking for doesn't exist or failed to load."
                actionLabel="Back to Vehicles"
                onAction={() => router.push("/mia/vehicles")}
            />
        );
    }

    if (customerLoading) {
        return <div className="text-sm text-muted-foreground">Loading owner details…</div>;
    }

    if (customerError || !customer) {
        return (
            <div className="text-red-500">Failed to load vehicle owner details.</div>
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
                backHref={`/mia/vehicles?customer=${customer.id}`}
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
                    <VehicleDetailQuickActions router={router} vehicleId={vehicle.id} vehicle={vehicle} isLoading={vehicleLoading} error={vehicleError} />
                </div>
            </div>
        </motion.div>
    );
}