import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface VehiclesHeaderProps {
    onAddClick: () => void;
    addDisabled?: boolean;
}

export function VehiclesHeader({ onAddClick, addDisabled }: VehiclesHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Vehicles</h1>
                <p className="text-muted-foreground mt-1">Manage customer vehicles</p>
            </div>
            <Button
                onClick={onAddClick}
                disabled={addDisabled}
                className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
            </Button>
        </div>
    );
}