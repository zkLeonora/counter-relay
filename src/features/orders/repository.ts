import { db } from "@/lib/db/db";
import { orders } from "@/lib/db/schema/orders";
import { orderItems } from "@/lib/db/schema/order-items";
import { customers } from "@/lib/db/schema/customers";
import { users } from "@/lib/db/schema/users";
import { eq, desc, and, ilike, or, sql } from "drizzle-orm";
import { OrderItemFull, OrderItemDetail } from "./types";

export async function getOrders(options?: {
  search?: string;
  paymentStatus?: string;
  orderStatus?: string;
}): Promise<OrderItemFull[]> {
  try {
    const conditions = [];
    if (options?.paymentStatus && options.paymentStatus !== "all") {
      conditions.push(eq(orders.paymentStatus, options.paymentStatus as any));
    }
    if (options?.orderStatus && options.orderStatus !== "all") {
      conditions.push(eq(orders.orderStatus, options.orderStatus as any));
    }
    if (options?.search) {
      const query = `%${options.search}%`;
      conditions.push(
        or(
          ilike(orders.receiptNumber, query),
          ilike(customers.name, query)
        )
      );
    }

    const orderRows = await db
      .select({
        id: orders.id,
        receiptNumber: orders.receiptNumber,
        storeId: orders.storeId,
        customerId: orders.customerId,
        customerName: sql<string>`COALESCE(${customers.name}, 'Walk-in Customer')`,
        cashierId: orders.cashierId,
        cashierName: sql<string>`COALESCE(${users.name}, 'Register 01 Cashier')`,
        subtotal: orders.subtotal,
        discount: orders.discount,
        tax: orders.tax,
        total: orders.total,
        paymentMethod: orders.paymentMethod,
        paymentStatus: orders.paymentStatus,
        orderStatus: orders.orderStatus,
        notes: orders.notes,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .leftJoin(customers, eq(customers.id, orders.customerId))
      .leftJoin(users, eq(users.id, orders.cashierId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(orders.createdAt));

    if (!orderRows || orderRows.length === 0) return [];

    // Fetch line items for all orders
    const allItems = await db.select().from(orderItems);

    return orderRows.map((o) => {
      const itemsForOrder = allItems
        .filter((item) => item.orderId === o.id)
        .map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          quantity: item.quantity,
          price: Number(item.price),
          subtotal: Number(item.subtotal),
        }));

      return {
        id: o.id,
        receiptNumber: o.receiptNumber,
        storeId: o.storeId,
        customerId: o.customerId,
        customerName: o.customerName,
        cashierId: o.cashierId,
        cashierName: o.cashierName,
        subtotal: Number(o.subtotal),
        discount: Number(o.discount),
        tax: Number(o.tax),
        total: Number(o.total),
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        orderStatus: o.orderStatus,
        notes: o.notes,
        items: itemsForOrder,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      };
    });
  } catch (error) {
    console.warn("Failed to fetch orders from DB:", error);
    return [];
  }
}

export async function getOrderById(id: string): Promise<OrderItemFull | null> {
  const allOrders = await getOrders();
  return allOrders.find((o) => o.id === id) || null;
}
