"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Car as CarIcon } from "lucide-react";
import EmptyState from "@/components/mia/common/EmptyState";
import { CardSkeleton } from "@/components/mia/common/LoadingSkeleton";
import { useSearchParams } from "next/navigation";
import { VehiclesHeader } from "@/components/mia/vehicles/VehiclesHeader";
import { SelectCustomerCard } from "@/components/mia/vehicles/SelectCustomerCard";
import { AddVehicleDialog } from "@/components/mia/vehicles/AddVehicleDialog";
import { VehicleGrid } from "@/components/mia/vehicles/VehicleGrid";
import { useCustomerById } from "@/hooks/customer/useCustomer";
import { useVehiclesByCustomerId } from "@/hooks/vehicles/useVehicles";

function VehiclesPageContent() {
    const searchParams = useSearchParams();
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Set customer from URL params on mount
    useEffect(() => {
        const customerFromUrl = searchParams?.get("customer");
        if (customerFromUrl) {
            setSelectedCustomerId(customerFromUrl);
        }
    }, [searchParams]);

    const { data: displayedVehicles, isLoading: vehiclesLoading, error: vehiclesError } = useVehiclesByCustomerId(selectedCustomerId);
    const { data: selectedCustomer, error: selectedCustomerError } = useCustomerById(selectedCustomerId);

    if (vehiclesLoading) {
        return (
            <div className="space-y-6">
                <div className="h-10 w-64 rounded shimmer" />
                <CardSkeleton count={3} />
            </div>
        );
    }

    if (selectedCustomerId && selectedCustomerError) {
        return <div className="text-red-500">Failed to load selected customer.</div>;
    }
    if (selectedCustomerId && vehiclesError) {
        return <div className="text-red-500">Failed to load vehicles.</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <VehiclesHeader
                onAddClick={() => setIsAddDialogOpen(true)}
                addDisabled={!selectedCustomerId}
            />
            <AddVehicleDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                selectedCustomerName={selectedCustomer?.name}
                selectedCustomerId={selectedCustomerId}
            />

            <SelectCustomerCard value={selectedCustomerId} onChange={setSelectedCustomerId} selectedCustomer={selectedCustomer} />

            {!selectedCustomerId ? (
                <EmptyState
                    icon={CarIcon}
                    title="No customer selected"
                    description="Select a customer above to view their vehicles and manage their fleet."
                />
            ) : (displayedVehicles?.length ?? 0) === 0 ? (
                <EmptyState
                    icon={CarIcon}
                    title="No vehicles registered"
                    description={`${selectedCustomer?.name} doesn't have any vehicles yet. Add their first vehicle to get started.`}
                    actionLabel="Add Vehicle"
                    onAction={() => setIsAddDialogOpen(true)}
                />
            ) : (
                <>
                    <div className="flex items-center justify-between px-1">
                        <p className="text-sm text-muted-foreground">
                            Showing {displayedVehicles?.length ?? 0} vehicle{(displayedVehicles?.length ?? 0) !== 1 ? "s" : ""} for{" "}
                            <span className="font-medium text-foreground">{selectedCustomer?.name}</span>
                        </p>
                    </div>

                    <VehicleGrid vehicles={displayedVehicles!} />
                </>
            )}
        </motion.div>
    );
}

export default function VehiclesPage() {
    return (
        <Suspense
            fallback={
                <div className="space-y-6">
                    <div className="h-10 w-64 rounded shimmer" />
                    <CardSkeleton count={3} />
                </div>
            }
        >
            <VehiclesPageContent />
        </Suspense>
    );
}