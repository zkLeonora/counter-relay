import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Full name is required").max(150, "Name is too long"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["owner", "manager", "cashier"]),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = createUserSchema.extend({
  id: z.string().uuid("Invalid User ID"),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
