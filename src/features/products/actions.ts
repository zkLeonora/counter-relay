'use server';

import { revalidatePath } from "next/cache";
import { createProductSchema, updateProductSchema } from "./validators";
import {
  createProductService,
  updateProductService,
  deleteProductService,
  toggleProductActiveService
} from "./service";

export async function createProductAction(data: any) {
  try {
    const validated = createProductSchema.parse(data);
    const result = await createProductService(validated);
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create product" };
  }
}

export async function updateProductAction(data: any) {
  try {
    const validated = updateProductSchema.parse(data);
    const result = await updateProductService(validated);
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update product" };
  }
}

export async function toggleProductActiveAction(id: string, isActive: boolean) {
  try {
    await toggleProductActiveService(id, isActive);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update product status" };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await deleteProductService(id);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete product" };
  }
}
