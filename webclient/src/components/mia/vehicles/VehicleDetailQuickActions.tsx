"use client";

import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditVehicleDialog } from "@/components/mia/vehicles/EditVehicleDialog";

interface VehicleDetailQuickActionsProps {
    vehicleId: string;
}

export function VehicleDetailQuickActions({ vehicleId }: VehicleDetailQuickActionsProps) {
    const router = useRouter();
    const [editOpen, setEditOpen] = useState(false);
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
            <EditVehicleDialog open={editOpen} onOpenChange={setEditOpen} vehicleId={vehicleId} />
        </div>
    );
}