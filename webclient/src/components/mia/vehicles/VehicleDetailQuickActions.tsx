"use client";

import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

export function VehicleDetailQuickActions() {
    const router = useRouter();
    return (
        <div className="glass-card p-6 rounded-xl space-y-3">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <Button className="w-full bg-gradient-to-r from-primary to-blue-500" onClick={() => router.push("/mia/service-jobs/new")}>
                <Wrench className="w-4 h-4 mr-2" />
                Create Service Job
            </Button>
            <Button variant="outline" className="w-full border-primary/30">Edit Vehicle</Button>
        </div>
    );
}