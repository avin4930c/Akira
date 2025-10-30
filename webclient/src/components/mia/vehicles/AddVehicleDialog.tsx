import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMiaStore } from "@/stores/mia-data-store";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVehicleSchema, type CreateVehicleInput } from "@/schema/vehicle";
import { VehicleFields } from "@/components/mia/vehicles/VehicleFields";

interface AddVehicleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCustomerName?: string;
    selectedCustomerId?: string;
}

export function AddVehicleDialog({ open, onOpenChange, selectedCustomerName, selectedCustomerId }: AddVehicleDialogProps) {
    const { addVehicle } = useMiaStore();
    const form = useForm<CreateVehicleInput>({
        resolver: zodResolver(createVehicleSchema) as Resolver<CreateVehicleInput>,
        defaultValues: {
            customer_id: selectedCustomerId || "",
            make: "",
            model: "",
            year: new Date().getFullYear(),
            registration: "",
            mileage: 0,
            engine_type: "",
            last_service_date: "",
        },
    });

    useEffect(() => {
        if (selectedCustomerId) {
            form.setValue("customer_id", selectedCustomerId);
        }
    }, [selectedCustomerId, form]);

    const handleAddVehicle = async (values: CreateVehicleInput) => {
        if (!values.customer_id) {
            toast.error("Please select a customer first");
            return;
        }
        addVehicle(values);
        toast.success("Vehicle added locally");
        onOpenChange(false);
        form.reset({
            customer_id: selectedCustomerId || "",
            make: "",
            model: "",
            year: new Date().getFullYear(),
            registration: "",
            mileage: 0,
            engine_type: "",
            last_service_date: "",
        });

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
                    <form onSubmit={form.handleSubmit(handleAddVehicle)} className="space-y-4">
                        <input type="hidden" {...form.register("customer_id")} />
                        <VehicleFields form={form} />
                        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-gradient-to-r from-primary to-blue-500">
                            {form.formState.isSubmitting ? "Adding..." : "Add Vehicle"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}