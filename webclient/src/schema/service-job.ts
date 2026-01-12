import { z } from "zod";
import { ServiceJobStatus } from "@/types/mia";

export const serviceJobBaseSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  vehicle_id: z.string().min(1, "Vehicle is required"),
  mechanic_id: z.string().min(1, "Mechanic is required"),
  service_info: z.string().min(1, "Service info is required"),
  mechanic_notes: z.string().min(1, "Mechanic notes are required"),
});

export const createServiceJobSchema = serviceJobBaseSchema.extend({
  id: z.string().min(1, "ID is required"),
  status: z.enum(ServiceJobStatus).default(ServiceJobStatus.Pending),
  validated_at: z.string().optional(),
  created_at: z.string().optional(),
});

export const updateServiceJobSchema = serviceJobBaseSchema.partial().extend({
  status: z.enum(ServiceJobStatus).optional(),
  validated_at: z.string().optional(),
});

export type ServiceJobFormValues = z.infer<typeof serviceJobBaseSchema>;
export type CreateServiceJobInput = z.infer<typeof createServiceJobSchema>;
export type UpdateServiceJobInput = z.infer<typeof updateServiceJobSchema>;