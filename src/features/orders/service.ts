import { getOrders as getOrdersRepo, getOrderById as getOrderByIdRepo } from "./repository";
import { OrderItemFull } from "./types";

export async function getOrdersService(options?: {
  search?: string;
  paymentStatus?: string;
  orderStatus?: string;
}): Promise<OrderItemFull[]> {
  return await getOrdersRepo(options);
}

export async function getOrderByIdService(id: string): Promise<OrderItemFull | null> {
  return await getOrderByIdRepo(id);
}
