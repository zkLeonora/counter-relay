import { db } from "@/lib/db/db";
import { customers } from "@/lib/db/schema/customers";
import { orders } from "@/lib/db/schema/orders";
import { stores } from "@/lib/db/schema/stores";
import { eq, desc, and, ilike, or, sql } from "drizzle-orm";
import { CustomerItem, CreateCustomerInput, UpdateCustomerInput } from "./types";

export async function getDefaultStoreId(): Promise<string> {
  try {
    const storeList = await db.select({ id: stores.id }).from(stores).limit(1);
    if (storeList.length > 0) return storeList[0].id;
    const [newStore] = await db.insert(stores).values({
      name: "SoHo Flagship Store",
      slug: "soho-flagship",
      email: "admin@counter-relay.com"
    }).returning({ id: stores.id });
    return newStore.id;
  } catch (error) {
    return "00000000-0000-0000-0000-000000000001";
  }
}

export async function getCustomers(options?: {
  search?: string;
}): Promise<CustomerItem[]> {
  try {
    const conditions = [];
    if (options?.search) {
      const query = `%${options.search}%`;
      conditions.push(
        or(
          ilike(customers.name, query),
          ilike(customers.email, query),
          ilike(customers.phone, query)
        )
      );
    }

    const rows = await db
      .select({
        id: customers.id,
        storeId: customers.storeId,
        name: customers.name,
        email: customers.email,
        phone: customers.phone,
        address: customers.address,
        notes: customers.notes,
        loyaltyPoints: customers.loyaltyPoints,
        totalOrders: sql<number>`CAST(COUNT(${orders.id}) AS INTEGER)`,
        totalSpend: sql<number>`COALESCE(SUM(CAST(${orders.total} AS NUMERIC)), 0)`,
        createdAt: customers.createdAt,
        updatedAt: customers.updatedAt,
      })
      .from(customers)
      .leftJoin(orders, eq(orders.customerId, customers.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(customers.id)
      .orderBy(desc(customers.createdAt));

    return rows.map((r) => {
      const spend = Number(r.totalSpend);
      let tier: 'Standard' | 'Silver' | 'Gold' | 'VIP' = 'Standard';
      if (spend >= 5000) tier = 'VIP';
      else if (spend >= 1500) tier = 'Gold';
      else if (spend >= 500) tier = 'Silver';

      return {
        ...r,
        totalSpend: spend,
        tier,
      };
    });
  } catch (error) {
    console.warn("Failed to fetch customers from DB:", error);
    return [];
  }
}

export async function getCustomerById(id: string): Promise<CustomerItem | null> {
  try {
    const rows = await db
      .select({
        id: customers.id,
        storeId: customers.storeId,
        name: customers.name,
        email: customers.email,
        phone: customers.phone,
        address: customers.address,
        notes: customers.notes,
        loyaltyPoints: customers.loyaltyPoints,
        totalOrders: sql<number>`CAST(COUNT(${orders.id}) AS INTEGER)`,
        totalSpend: sql<number>`COALESCE(SUM(CAST(${orders.total} AS NUMERIC)), 0)`,
        createdAt: customers.createdAt,
        updatedAt: customers.updatedAt,
      })
      .from(customers)
      .leftJoin(orders, eq(orders.customerId, customers.id))
      .where(eq(customers.id, id))
      .groupBy(customers.id)
      .limit(1);

    if (!rows[0]) return null;

    const spend = Number(rows[0].totalSpend);
    let tier: 'Standard' | 'Silver' | 'Gold' | 'VIP' = 'Standard';
    if (spend >= 5000) tier = 'VIP';
    else if (spend >= 1500) tier = 'Gold';
    else if (spend >= 500) tier = 'Silver';

    return {
      ...rows[0],
      totalSpend: spend,
      tier,
    };
  } catch (error) {
    console.warn("Failed to fetch customer by ID:", error);
    return null;
  }
}

export async function createCustomer(input: CreateCustomerInput, storeId: string): Promise<CustomerItem> {
  const [created] = await db
    .insert(customers)
    .values({
      storeId,
      name: input.name,
      email: input.email || null,
      phone: input.phone || null,
      address: input.address || null,
      notes: input.notes || null,
      loyaltyPoints: 0,
    })
    .returning();

  return {
    ...created,
    totalOrders: 0,
    totalSpend: 0,
    tier: 'Standard',
  };
}

export async function updateCustomer(input: UpdateCustomerInput): Promise<CustomerItem> {
  const [updated] = await db
    .update(customers)
    .set({
      name: input.name,
      email: input.email || null,
      phone: input.phone || null,
      address: input.address || null,
      notes: input.notes || null,
      updatedAt: new Date(),
    })
    .where(eq(customers.id, input.id))
    .returning();

  const existing = await getCustomerById(input.id);

  return {
    ...updated,
    totalOrders: existing?.totalOrders || 0,
    totalSpend: existing?.totalSpend || 0,
    tier: existing?.tier || 'Standard',
  };
}

export async function deleteCustomer(id: string): Promise<boolean> {
  const result = await db
    .delete(customers)
    .where(eq(customers.id, id))
    .returning({ id: customers.id });

  return result.length > 0;
}
