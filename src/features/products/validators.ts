import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200, "Name is too long"),
  sku: z.string().min(1, "SKU is required").max(50, "SKU is too long"),
  barcode: z.string().optional().nullable(),
  categoryId: z.string().uuid("Invalid Category ID").optional().nullable().or(z.literal("")),
  purchasePrice: z.number().min(0, "Purchase price must be positive"),
  sellingPrice: z.number().min(0, "Selling price must be positive"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  minimumStock: z.number().int().min(0, "Minimum stock must be non-negative"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  trackStock: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.extend({
  id: z.string().uuid("Invalid Product ID"),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
