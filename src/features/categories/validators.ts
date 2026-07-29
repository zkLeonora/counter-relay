import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().optional(),
});

export const updateCategorySchema = z.object({
  id: z.string().uuid("Invalid category ID"),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().optional(),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
