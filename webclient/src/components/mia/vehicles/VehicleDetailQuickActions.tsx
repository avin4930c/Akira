"use client";

import { Button } from "@/components/ui/button";
import { Wrench, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditVehicleDialog } from "@/components/mia/vehicles/EditVehicleDialog";
import type { Vehicle } from "@/types/mia";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import { useDeleteVehicleMutation } from "@/hooks/vehicles/useVehicles";
import { toast } from "sonner";

interface VehicleDetailQuickActionsProps {
    vehicleId: string;
    vehicle: Vehicle;
    isLoading: boolean;
    error: unknown;
}

export function VehicleDetailQuickActions({ vehicleId, vehicle, isLoading, error }: VehicleDetailQuickActionsProps) {
    const router = useRouter();
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteMutation = useDeleteVehicleMutation(vehicle.customer_id, router);

    async function handleDeleteVehicle() {
        try {
            await deleteMutation.mutateAsync(vehicleId);
            toast.success("Vehicle deleted");
        } catch (e) {
            toast.error("Failed to delete vehicle");
        }
    }

    return (
        <div className="glass-card p-6 rounded-xl space-y-3">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <Button className="w-full bg-gradient-to-r from-primary to-blue-500" onClick={() => router.push("/mia/service-jobs/new")}>
                <Wrench className="w-4 h-4 mr-2" />
                Create Service Job
            </Button>
            <Button
                variant="outline"
                className="w-full border-primary/30"
                onClick={() => setEditOpen(true)}
            >
                Edit Vehicle
            </Button>
            <Button
                variant="destructive"
                className="w-full"
                onClick={() => setDeleteOpen(true)}
            >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Vehicle
            </Button>
            <EditVehicleDialog open={editOpen} onOpenChange={setEditOpen} vehicleId={vehicleId} vehicle={vehicle} isLoading={isLoading} error={error} />

            <ConfirmDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete Vehicle"
                description={<span>This action cannot be undone. This will permanently delete the vehicle <span className="font-medium text-foreground">{vehicle.make} {vehicle.model}</span>.</span>}
                loading={deleteMutation.isPending}
                onConfirm={handleDeleteVehicle}
            />
        </div>
    );
}