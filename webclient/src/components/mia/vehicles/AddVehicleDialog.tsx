import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMiaStore } from "@/stores/mia-data-store";
import { toast } from "sonner";
import { useState } from "react";

interface AddVehicleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCustomerName?: string;
    selectedCustomerId?: string;
}

export function AddVehicleDialog({ open, onOpenChange, selectedCustomerName, selectedCustomerId }: AddVehicleDialogProps) {
    const { addVehicle } = useMiaStore();
    const [vehicleForm, setVehicleForm] = useState({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        registration: "",
        mileage: 0,
        engine_type: "",
        last_service_date: "",
    });

    const reset = () =>
        setVehicleForm({
            make: "",
            model: "",
            year: new Date().getFullYear(),
            registration: "",
            mileage: 0,
            engine_type: "",
            last_service_date: "",
        });

    const handleAddVehicle = () => {
        if (!selectedCustomerId) {
            toast.error("Please select a customer first");
            return;
        }
        if (!vehicleForm.make || !vehicleForm.model || !vehicleForm.registration) {
            toast.error("Please fill all required fields");
            return;
        }

        addVehicle({ ...vehicleForm, customer_id: selectedCustomerId });
        toast.success("Vehicle added successfully");
        onOpenChange(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass-card border-primary/20 max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Add New Vehicle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    {selectedCustomerName && (
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                            <div className="text-sm text-muted-foreground">Customer</div>
                            <div className="font-medium">{selectedCustomerName}</div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="make">Make *</Label>
                            <Input id="make" placeholder="Yamaha" className="mt-1.5" value={vehicleForm.make} onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })} />
                        </div>
                        <div>
                            <Label htmlFor="model">Model *</Label>
                            <Input id="model" placeholder="MT-07" className="mt-1.5" value={vehicleForm.model} onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="year">Year *</Label>
                            <Input id="year" type="number" placeholder="2023" className="mt-1.5" value={vehicleForm.year} onChange={(e) => setVehicleForm({ ...vehicleForm, year: parseInt(e.target.value) || new Date().getFullYear() })} />
                        </div>
                        <div>
                            <Label htmlFor="registration">Registration No. *</Label>
                            <Input id="registration" placeholder="ABC-1234" className="mt-1.5" value={vehicleForm.registration} onChange={(e) => setVehicleForm({ ...vehicleForm, registration: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="mileage">Mileage (km)</Label>
                        <Input id="mileage" type="number" placeholder="12500" className="mt-1.5" value={vehicleForm.mileage} onChange={(e) => setVehicleForm({ ...vehicleForm, mileage: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div>
                        <Label htmlFor="engine">Engine Type *</Label>
                        <Input id="engine" placeholder="689cc Parallel Twin" className="mt-1.5" value={vehicleForm.engine_type} onChange={(e) => setVehicleForm({ ...vehicleForm, engine_type: e.target.value })} />
                    </div>
                    <div>
                        <Label htmlFor="lastService">Last Service Date</Label>
                        <Input id="lastService" type="date" className="mt-1.5" value={vehicleForm.last_service_date} onChange={(e) => setVehicleForm({ ...vehicleForm, last_service_date: e.target.value })} />
                    </div>
                    <Button onClick={handleAddVehicle} className="w-full bg-gradient-to-r from-primary to-blue-500">
                        Add Vehicle
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}