import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required").max(150, "Name is too long"),
  email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required").max(30, "Phone number is too long"),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateCustomerSchema = createCustomerSchema.extend({
  id: z.string().uuid("Invalid Customer ID"),
});

export type CreateCustomerSchema = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerSchema = z.infer<typeof updateCustomerSchema>;
