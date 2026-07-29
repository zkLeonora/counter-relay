'use server';

import { revalidatePath } from "next/cache";
import { createCategorySchema, updateCategorySchema } from "./validators";
import { createCategoryService, updateCategoryService, deleteCategoryService } from "./service";

export async function createCategoryAction(data: { name: string; description?: string }) {
  try {
    const validated = createCategorySchema.parse(data);
    const result = await createCategoryService(validated);
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create category" };
  }
}

export async function updateCategoryAction(data: { id: string; name: string; description?: string }) {
  try {
    const validated = updateCategorySchema.parse(data);
    const result = await updateCategoryService(validated);
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update category" };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await deleteCategoryService(id);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete category" };
  }
}
