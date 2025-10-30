import { z } from "zod";

export const vehicleBaseSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .coerce.number()
    .int("Year must be an integer")
    .min(1900, "Year seems too early")
    .max(new Date().getFullYear() + 1, "Year seems too far in future"),
  registration: z
    .string()
    .min(1, "Registration is required")
    .max(20, "Registration too long"),
  mileage: z
    .coerce.number()
    .int("Mileage must be an integer")
    .min(0, "Mileage cannot be negative"),
  engine_type: z.string().min(1, "Engine type is required"),
  last_service_date: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), {
      message: "Invalid date",
    }),
});

export const createVehicleSchema = vehicleBaseSchema.extend({
  customer_id: z.string().min(1, "Customer is required"),
});

export const updateVehicleSchema = vehicleBaseSchema;

export type VehicleFormValues = z.infer<typeof vehicleBaseSchema>;
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof vehicleBaseSchema>;