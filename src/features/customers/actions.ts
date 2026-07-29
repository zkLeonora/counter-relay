'use server';

import { revalidatePath } from "next/cache";
import { createCustomerSchema, updateCustomerSchema } from "./validators";
import {
  createCustomerService,
  updateCustomerService,
  deleteCustomerService
} from "./service";

export async function createCustomerAction(data: any) {
  try {
    const validated = createCustomerSchema.parse(data);
    const result = await createCustomerService(validated);
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create customer" };
  }
}

export async function updateCustomerAction(data: any) {
  try {
    const validated = updateCustomerSchema.parse(data);
    const result = await updateCustomerService(validated);
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update customer" };
  }
}

export async function deleteCustomerAction(id: string) {
  try {
    await deleteCustomerService(id);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete customer" };
  }
}
