import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateVehicleSchema, type VehicleFormValues } from "@/schema/vehicle";
import { useEffect } from "react";
import { toast } from "sonner";
import { VehicleFields } from "@/components/mia/vehicles/VehicleFields";
import { useUpdateVehicleMutation, useVehicleById } from "@/hooks/vehicles/useVehicles";
import type { Vehicle } from "@/types/mia";

interface EditVehicleDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  vehicleId: string;
  vehicle: Vehicle;
  isLoading: boolean;
  error: unknown;
}

export function EditVehicleDialog({ open, onOpenChange, vehicleId, vehicle, isLoading, error }: EditVehicleDialogProps) {
  const updateMutation = useUpdateVehicleMutation();

  const existing = vehicle;

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(updateVehicleSchema) as Resolver<VehicleFormValues>,
    defaultValues: existing
      ? {
          make: existing.make,
          model: existing.model,
          year: existing.year,
          registration: existing.registration,
          mileage: existing.mileage,
          engine_type: existing.engine_type,
          last_service_date: existing.last_service_date,
        }
      : undefined,
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        make: existing.make,
        model: existing.model,
        year: existing.year,
        registration: existing.registration,
        mileage: existing.mileage,
        engine_type: existing.engine_type,
        last_service_date: existing.last_service_date,
      });
    }
  }, [existing?.id, form]);

  async function onSubmit(values: VehicleFormValues) {
    if (!existing) return;
    try {
      const payload = {
        ...values,
        last_service_date: values.last_service_date || undefined,
      };
      await updateMutation.mutateAsync({ vehicleId, data: payload });
      toast.success("Vehicle updated");
      onOpenChange(false);
    } catch (e) {
      toast.error("Failed to update vehicle");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-primary/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Vehicle</DialogTitle>
        </DialogHeader>
        {isLoading && !existing ? (
          <p className="text-muted-foreground">Loading vehicle…</p>
        ) : error ? (
          <p className="text-red-500">Failed to load vehicle.</p>
        ) : !existing ? (
          <p className="text-muted-foreground">Vehicle not found.</p>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <VehicleFields form={form} />
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="bg-gradient-to-r from-primary to-blue-500">
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}