import { z } from "zod";

export const checkoutSchema = z.object({
  customerId: z.string().uuid("Invalid Customer ID").optional().nullable(),
  items: z.array(
    z.object({
      productId: z.string().uuid("Invalid Product ID"),
      productName: z.string().min(1),
      productSku: z.string().min(1),
      quantity: z.number().int().min(1, "Quantity must be at least 1"),
      price: z.number().min(0),
      subtotal: z.number().min(0),
    })
  ).min(1, "Cart must contain at least 1 item"),
  subtotal: z.number().min(0),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  total: z.number().min(0),
  paymentMethod: z.enum(["cash", "card", "transfer", "ewallet"]),
  amountPaid: z.number().min(0),
  change: z.number().min(0),
  notes: z.string().optional().nullable(),
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
