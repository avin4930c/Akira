import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVehicleSchema, type CreateVehicleInput } from "@/schema/vehicle";
import { VehicleFields } from "../components/VehicleFields";
import { useAddVehicleMutation } from "@/hooks/vehicles/useVehicles";

interface AddVehicleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCustomerName?: string;
    selectedCustomerId?: string;
}

export function AddVehicleDialog({ open, onOpenChange, selectedCustomerName, selectedCustomerId }: AddVehicleDialogProps) {
    const addVehicleMutation = useAddVehicleMutation();
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
        try {
            await addVehicleMutation.mutateAsync(values);
            toast.success("Successfully added vehicle");
        } catch (e) {
            toast.error("Failed to add vehicle");
            return;
        }
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
            <DialogContent className="bg-[#111111] border border-border/10 max-w-2xl">
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
                        <VehicleFields register={form.register} errors={form.formState.errors} />
                        <Button type="submit" disabled={addVehicleMutation.isPending} className="w-full bg-gradient-to-r from-primary to-blue-500">
                            {addVehicleMutation.isPending ? "Adding..." : "Add Vehicle"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}