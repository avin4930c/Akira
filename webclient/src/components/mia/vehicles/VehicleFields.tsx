import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { UseFormReturn, Path } from "react-hook-form";

type VehicleFieldShape = {
    make: string;
    model: string;
    year: number;
    registration: string;
    mileage: number;
    engine_type: string;
    last_service_date?: string;
};

export function VehicleFields<T extends VehicleFieldShape>({ form }: { form: UseFormReturn<T> }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="make">Make *</Label>
                    <Input id="make" placeholder="Yamaha" className="mt-1.5" {...form.register("make" as Path<T>)} />
                    {form.formState.errors.make && (
                        <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.make.message)}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="model">Model *</Label>
                    <Input id="model" placeholder="MT-07" className="mt-1.5" {...form.register("model" as Path<T>)} />
                    {form.formState.errors.model && (
                        <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.model.message)}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="year">Year *</Label>
                    <Input id="year" type="number" placeholder="2023" className="mt-1.5" {...form.register("year" as Path<T>, { valueAsNumber: true })} />
                    {form.formState.errors.year && (
                        <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.year.message)}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="registration">Registration No. *</Label>
                    <Input id="registration" placeholder="ABC-1234" className="mt-1.5" {...form.register("registration" as Path<T>)} />
                    {form.formState.errors.registration && (
                        <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.registration.message)}</p>
                    )}
                </div>
            </div>

            <div>
                <Label htmlFor="mileage">Mileage (km)</Label>
                <Input id="mileage" type="number" placeholder="12500" className="mt-1.5" {...form.register("mileage" as Path<T>, { valueAsNumber: true })} />
                {form.formState.errors.mileage && (
                    <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.mileage.message)}</p>
                )}
            </div>

            <div>
                <Label htmlFor="engine">Engine Type *</Label>
                <Input id="engine" placeholder="689cc Parallel Twin" className="mt-1.5" {...form.register("engine_type" as Path<T>)} />
                {form.formState.errors.engine_type && (
                    <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.engine_type.message)}</p>
                )}
            </div>

            <div>
                <Label htmlFor="lastService">Last Service Date</Label>
                <Input id="lastService" type="date" className="mt-1.5" {...form.register("last_service_date" as Path<T>)} />
                {form.formState.errors.last_service_date && (
                    <p className="text-sm text-red-500 mt-1">{String(form.formState.errors.last_service_date.message)}</p>
                )}
            </div>
        </div>
    );
}