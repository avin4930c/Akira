import { z } from "zod";
import { ServiceJobStatus } from "@/types/mia";
import { MIN_NOTES_LENGTH, MIN_SERVICE_INFO_LENGTH } from "@/constants/notesFieldConstants";

export const serviceJobBaseSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  vehicle_id: z.string().min(1, "Vehicle is required"),
  mechanic_id: z.string().min(1, "Mechanic is required"),
  service_info: z.string().min(MIN_SERVICE_INFO_LENGTH, `Service info must be at least ${MIN_SERVICE_INFO_LENGTH} characters`),
  mechanic_notes: z.string().min(MIN_NOTES_LENGTH, `Mechanic notes must be at least ${MIN_NOTES_LENGTH} characters`),
});

export const createServiceJobSchema = serviceJobBaseSchema.extend({
  id: z.string().min(1, "ID is required"),
  status: z.nativeEnum(ServiceJobStatus).default(ServiceJobStatus.Pending),
  validated_at: z.string().optional(),
  created_at: z.string().optional(),
});

export const updateServiceJobSchema = serviceJobBaseSchema.partial().extend({
  status: z.nativeEnum(ServiceJobStatus).optional(),
  validated_at: z.string().optional(),
});

export type ServiceJobFormValues = z.infer<typeof serviceJobBaseSchema>;
export type CreateServiceJobInput = z.infer<typeof createServiceJobSchema>;
export type UpdateServiceJobInput = z.infer<typeof updateServiceJobSchema>;