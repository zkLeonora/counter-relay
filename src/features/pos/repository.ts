import { db } from "@/lib/db/db";
import { orders } from "@/lib/db/schema/orders";
import { orderItems } from "@/lib/db/schema/order-items";
import { payments } from "@/lib/db/schema/payments";
import { products } from "@/lib/db/schema/products";
import { stockMovements } from "@/lib/db/schema/stock-movements";
import { customers } from "@/lib/db/schema/customers";
import { stores } from "@/lib/db/schema/stores";
import { users } from "@/lib/db/schema/users";
import { eq, sql } from "drizzle-orm";
import { CheckoutInput, CompletedOrderReceipt } from "./types";

export async function getDefaultStoreAndCashier() {
  try {
    const storeList = await db.select().from(stores).limit(1);
    let storeId = storeList[0]?.id;
    let storeName = storeList[0]?.name || "SoHo Flagship Store";

    if (!storeId) {
      const [newStore] = await db.insert(stores).values({
        name: "SoHo Flagship Store",
        slug: "soho-flagship",
        email: "admin@counter-relay.com",
      }).returning();
      storeId = newStore.id;
      storeName = newStore.name;
    }

    const userList = await db.select().from(users).limit(1);
    let cashierId = userList[0]?.id;
    let cashierName = userList[0]?.name || "Register 01 Cashier";

    if (!cashierId) {
      const [newUser] = await db.insert(users).values({
        storeId,
        authUserId: "system-cashier-01",
        email: "cashier@counter-relay.com",
        name: "Register 01 Cashier",
        role: "cashier",
      }).returning();
      cashierId = newUser.id;
      cashierName = newUser.name;
    }

    return { storeId, storeName, cashierId, cashierName };
  } catch (error) {
    return {
      storeId: "00000000-0000-0000-0000-000000000001",
      storeName: "SoHo Flagship Store",
      cashierId: "00000000-0000-0000-0000-000000000002",
      cashierName: "Register 01 Cashier",
    };
  }
}

export async function processPOSCheckoutTransaction(input: CheckoutInput): Promise<CompletedOrderReceipt> {
  const { storeId, storeName, cashierId, cashierName } = await getDefaultStoreAndCashier();

  // Execute entire checkout process inside a single Database Transaction for ACID compliance
  return await db.transaction(async (tx) => {
    // 1. Generate Receipt Number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const receiptNumber = `POS-${dateStr}-${randomSuffix}`;

    // 2. Insert Order Header
    const [newOrder] = await tx
      .insert(orders)
      .values({
        receiptNumber,
        storeId,
        customerId: input.customerId || null,
        cashierId,
        subtotal: input.subtotal.toString(),
        discount: input.discount.toString(),
        tax: input.tax.toString(),
        total: input.total.toString(),
        paymentMethod: input.paymentMethod,
        paymentStatus: "paid",
        orderStatus: "completed",
        notes: input.notes || null,
      })
      .returning();

    // 3. Insert Order Line Items
    for (const item of input.items) {
      await tx.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        quantity: item.quantity,
        price: item.price.toString(),
        subtotal: item.subtotal.toString(),
      });
    }

    // 4. Insert Payment Record
    await tx.insert(payments).values({
      orderId: newOrder.id,
      amount: input.total.toString(),
      method: input.paymentMethod,
      reference: `PAY-${receiptNumber}`,
      status: "paid",
      paidAt: new Date(),
      notes: `Amount Paid: $${input.amountPaid.toFixed(2)}, Change: $${input.change.toFixed(2)}`,
    });

    // 5. Update Product Stock & Record Stock Movement for each item
    for (const item of input.items) {
      const [prod] = await tx
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (prod) {
        const previousStock = prod.stock;
        const currentStock = Math.max(0, previousStock - item.quantity);

        await tx
          .update(products)
          .set({
            stock: currentStock,
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.productId));

        await tx.insert(stockMovements).values({
          productId: item.productId,
          userId: cashierId,
          type: "sale",
          quantity: -item.quantity,
          previousStock,
          currentStock,
          notes: `POS Sale Receipt ${receiptNumber}`,
        });
      }
    }

    // 6. Update Customer Loyalty Points if Customer is attached
    let customerName = "Walk-in Customer";
    if (input.customerId) {
      const [cust] = await tx
        .select()
        .from(customers)
        .where(eq(customers.id, input.customerId))
        .limit(1);

      if (cust) {
        customerName = cust.name;
        const pointsEarned = Math.floor(input.total / 10);
        await tx
          .update(customers)
          .set({
            loyaltyPoints: cust.loyaltyPoints + pointsEarned,
            updatedAt: new Date(),
          })
          .where(eq(customers.id, input.customerId));
      }
    }

    // 7. Return Receipt Data Object
    return {
      orderId: newOrder.id,
      receiptNumber,
      storeName,
      cashierName,
      customerName,
      items: input.items.map((i) => ({
        name: i.productName,
        sku: i.productSku,
        quantity: i.quantity,
        price: i.price,
        subtotal: i.subtotal,
      })),
      subtotal: input.subtotal,
      discount: input.discount,
      tax: input.tax,
      total: input.total,
      paymentMethod: input.paymentMethod,
      amountPaid: input.amountPaid,
      change: input.change,
      createdAt: newOrder.createdAt,
    };
  });
}
