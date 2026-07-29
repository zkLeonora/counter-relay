'use server';

import { getOrdersService } from "./service";

export async function fetchOrdersAction(options?: any) {
  try {
    const data = await getOrdersService(options);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch orders" };
  }
}
