import { FormField } from "@/components/mia/common/FormField";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { VehicleFormValues, CreateVehicleInput } from "@/schema/vehicle";

type VehicleFieldsRegister = UseFormRegister<VehicleFormValues> | UseFormRegister<CreateVehicleInput>;
type VehicleFieldsErrors = FieldErrors<VehicleFormValues> | FieldErrors<CreateVehicleInput>;

interface VehicleFieldsProps {
    register: VehicleFieldsRegister;
    errors: VehicleFieldsErrors;
}

export function VehicleFields({ register, errors }: VehicleFieldsProps) {
    const reg = register as UseFormRegister<VehicleFormValues>;
    const err = errors as FieldErrors<VehicleFormValues>;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    id="make"
                    label="Make"
                    placeholder="e.g., Yamaha"
                    register={reg}
                    fieldName="make"
                    errors={err}
                    required
                />
                <FormField
                    id="model"
                    label="Model"
                    placeholder="e.g., MT-07"
                    register={reg}
                    fieldName="model"
                    errors={err}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    id="year"
                    label="Year"
                    placeholder="e.g., 2023"
                    type="number"
                    register={reg}
                    fieldName="year"
                    errors={err}
                    registerOptions={{ valueAsNumber: true }}
                    required
                />
                <FormField
                    id="registration"
                    label="Registration No."
                    placeholder="e.g., ABC-1234"
                    register={reg}
                    fieldName="registration"
                    errors={err}
                    required
                />
            </div>

            <FormField
                id="mileage"
                label="Mileage (km)"
                placeholder="e.g., 12500"
                type="number"
                register={reg}
                fieldName="mileage"
                errors={err}
                registerOptions={{ valueAsNumber: true }}
            />

            <FormField
                id="engine"
                label="Engine Type"
                placeholder="e.g., 689cc Parallel Twin"
                register={reg}
                fieldName="engine_type"
                errors={err}
                required
            />

            <FormField
                id="lastService"
                label="Last Service Date (Optional)"
                placeholder="Select date"
                type="date"
                register={reg}
                fieldName="last_service_date"
                errors={err}
            />
        </div>
    );
}