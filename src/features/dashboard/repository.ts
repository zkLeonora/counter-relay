import { db } from "@/lib/db/db";
import { orders } from "@/lib/db/schema/orders";
import { products } from "@/lib/db/schema/products";
import { eq, gte, lte, sql, desc, and, lt } from "drizzle-orm";
import { 
  RecentOrder, 
  DashboardChartPoint, 
  LowStockProduct 
} from "./types";
import { 
  INITIAL_ORDERS, 
  INITIAL_PRODUCTS, 
  HOURLY_SALES_METRICS 
} from "@/lib/constants/mockData";

/**
 * Dashboard Repository Layer
 * Handles pure data fetching from Drizzle ORM PostgreSQL database with fallback to initial data.
 * No formatting, currency conversion, or business calculation should happen in this layer.
 */

export async function getRevenueToday(): Promise<number> {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const result = await db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(CAST(${orders.total} AS NUMERIC)), 0)`
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, todayStart),
          eq(orders.paymentStatus, "paid")
        )
      );

    const dbVal = Number(result[0]?.totalRevenue || 0);
    if (dbVal > 0) return dbVal;
  } catch (error) {
    console.warn("DB query for getRevenueToday fell back to mock data:", error);
  }

  // Fallback mock dataset calculation
  return INITIAL_ORDERS
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);
}

export async function getOrdersToday(): Promise<number> {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const result = await db
      .select({
        orderCount: sql<number>`COUNT(*)`
      })
      .from(orders)
      .where(gte(orders.createdAt, todayStart));

    const dbVal = Number(result[0]?.orderCount || 0);
    if (dbVal > 0) return dbVal;
  } catch (error) {
    console.warn("DB query for getOrdersToday fell back to mock data:", error);
  }

  return INITIAL_ORDERS.length;
}

export async function getAverageBasket(): Promise<number> {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const result = await db
      .select({
        avgBasket: sql<number>`COALESCE(AVG(CAST(${orders.total} AS NUMERIC)), 0)`
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, todayStart),
          eq(orders.paymentStatus, "paid")
        )
      );

    const dbVal = Number(result[0]?.avgBasket || 0);
    if (dbVal > 0) return dbVal;
  } catch (error) {
    console.warn("DB query for getAverageBasket fell back to mock data:", error);
  }

  const paidOrders = INITIAL_ORDERS.filter(o => o.paymentStatus === 'paid');
  if (paidOrders.length === 0) return 0;
  const total = paidOrders.reduce((sum, o) => sum + o.total, 0);
  return total / paidOrders.length;
}

export async function getLowStockCount(): Promise<number> {
  try {
    const result = await db
      .select({
        count: sql<number>`COUNT(*)`
      })
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          sql`${products.stock} <= ${products.minimumStock}`
        )
      );

    const dbVal = Number(result[0]?.count || 0);
    if (dbVal > 0) return dbVal;
  } catch (error) {
    console.warn("DB query for getLowStockCount fell back to mock data:", error);
  }

  return INITIAL_PRODUCTS.filter(p => p.stock <= 5).length;
}

export async function getRecentOrders(): Promise<RecentOrder[]> {
  try {
    const dbOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(10);

    if (dbOrders && dbOrders.length > 0) {
      return dbOrders.map(o => ({
        id: o.id,
        orderNumber: o.receiptNumber,
        customerName: o.customerId ? "Customer" : "Walk-in Customer",
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        totalAmount: Number(o.total),
        createdAt: o.createdAt,
      }));
    }
  } catch (error) {
    console.warn("DB query for getRecentOrders fell back to mock data:", error);
  }

  return INITIAL_ORDERS.map(o => ({
    id: o.id,
    orderNumber: o.receiptNumber,
    customerName: o.customerName,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    totalAmount: o.total,
    createdAt: new Date(o.timestamp),
  }));
}

export async function getRevenueChart(): Promise<DashboardChartPoint[]> {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const result = await db
      .select({
        timeLabel: sql<string>`TO_CHAR(${orders.createdAt}, 'HH24:00')`,
        totalRevenue: sql<number>`COALESCE(SUM(CAST(${orders.total} AS NUMERIC)), 0)`
      })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, todayStart),
          eq(orders.paymentStatus, "paid")
        )
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'HH24:00')`)
      .orderBy(sql`TO_CHAR(${orders.createdAt}, 'HH24:00')`);

    if (result && result.length > 0) {
      return result.map(r => ({
        label: r.timeLabel,
        revenue: Number(r.totalRevenue),
      }));
    }
  } catch (error) {
    console.warn("DB query for getRevenueChart fell back to mock data:", error);
  }

  return HOURLY_SALES_METRICS.map(m => ({
    label: m.time,
    revenue: m.posRevenue + m.onlineRevenue,
  }));
}

export async function getLowStockProducts(): Promise<LowStockProduct[]> {
  try {
    const dbProducts = await db
      .select()
      .from(products)
      .where(sql`${products.stock} <= ${products.minimumStock}`)
      .limit(10);

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map(p => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        supplier: "Primary Supplier",
        binLocation: "A-01-01",
        stock: p.stock,
        minimumStock: p.minimumStock,
        costPrice: Number(p.purchasePrice || 0),
        status: p.stock <= 2 ? 'critical' : 'warning',
      }));
    }
  } catch (error) {
    console.warn("DB query for getLowStockProducts fell back to mock data:", error);
  }

  return INITIAL_PRODUCTS
    .filter(p => p.stock <= 5)
    .map(p => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      supplier: "Global Logistics",
      binLocation: "A-12-04",
      stock: p.stock,
      minimumStock: 5,
      costPrice: p.costPrice,
      status: p.stock <= 2 ? 'critical' : 'warning',
    }));
}

