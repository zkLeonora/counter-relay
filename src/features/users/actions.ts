'use server';

import { revalidatePath } from "next/cache";
import { createUserSchema, updateUserSchema } from "./validators";
import {
  createUserService,
  updateUserService,
  deleteUserService
} from "./service";
import { requireOwner } from "@/lib/auth/authorization";

export async function createUserAction(data: any) {
  try {
    // 🛡️ Step 5: Server Action Protection (Check Owner Role)
    await requireOwner();

    const validated = createUserSchema.parse(data);
    const result = await createUserService(validated);
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create user" };
  }
}

export async function updateUserAction(data: any) {
  try {
    // 🛡️ Step 5: Server Action Protection (Check Owner Role)
    await requireOwner();

    const validated = updateUserSchema.parse(data);
    const result = await updateUserService(validated);
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update user" };
  }
}

export async function deleteUserAction(id: string) {
  try {
    // 🛡️ Step 5: Server Action Protection (Check Owner Role)
    await requireOwner();

    await deleteUserService(id);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete user" };
  }
}
