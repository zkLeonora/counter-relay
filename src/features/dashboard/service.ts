import { 
  getRevenueToday, 
  getOrdersToday, 
  getAverageBasket, 
  getLowStockCount, 
  getRecentOrders, 
  getRevenueChart, 
  getLowStockProducts 
} from "./repository";
import { 
  DashboardSummary, 
  DashboardData 
} from "./types";

/**
 * Dashboard Service Layer
 * Orchestrates business logic and combines data fetched from repository functions.
 */

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [revenueToday, ordersToday, averageBasket, lowStockCount] = await Promise.all([
    getRevenueToday(),
    getOrdersToday(),
    getAverageBasket(),
    getLowStockCount(),
  ]);

  return {
    revenueToday,
    ordersToday,
    averageBasket,
    lowStockCount,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const [summary, recentOrders, chart, lowStockProducts] = await Promise.all([
    getDashboardSummary(),
    getRecentOrders(),
    getRevenueChart(),
    getLowStockProducts(),
  ]);

  return {
    summary,
    recentOrders,
    chart,
    lowStockProducts,
  };
}
