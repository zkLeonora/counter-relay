'use server';

import { revalidatePath } from "next/cache";
import { checkoutSchema } from "./validators";
import { processCheckoutService } from "./service";

export async function processCheckoutAction(data: any) {
  try {
    const validated = checkoutSchema.parse(data);
    const result = await processCheckoutService(validated);
    
    // Immediately revalidate root page path to trigger real-time Server Component update for Dashboard metrics & products stock
    revalidatePath("/");
    
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error?.message || "POS Checkout failed" };
  }
}
