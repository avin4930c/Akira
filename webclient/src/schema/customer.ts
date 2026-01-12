import { z } from "zod";

export const customerBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(5, "Phone must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
});

export const createCustomerSchema = customerBaseSchema.extend({
  id: z.string().min(1, "ID is required"),
});

export const updateCustomerSchema = customerBaseSchema.partial().extend({
  vehicle_count: z.number().optional(),
});

export type CustomerFormValues = z.infer<typeof customerBaseSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;