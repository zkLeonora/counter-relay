export type DateRangeFilter = 'today' | 'yesterday' | '7days' | '30days' | 'all';

export interface SalesReportSummary {
  grossRevenue: number;
  netRevenue: number;
  ordersCount: number;
  averageBasket: number;
  totalTax: number;
  totalDiscount: number;
}

export interface TopProductReport {
  productId: string;
  name: string;
  sku: string;
  quantitySold: number;
  totalRevenue: number;
  totalProfit: number;
}

export interface CustomerAnalyticsReport {
  totalCustomers: number;
  newCustomersThisMonth: number;
  vipCustomersCount: number;
  topSpendingCustomers: {
    id: string;
    name: string;
    tier: string;
    totalOrders: number;
    totalSpend: number;
  }[];
}

export interface PaymentAnalyticsReport {
  method: string;
  totalAmount: number;
  count: number;
  percentage: number;
}

export interface InventoryAnalyticsReport {
  totalProductsCount: number;
  totalStockUnits: number;
  totalStockValueCost: number;
  totalStockValueRetail: number;
  lowStockCount: number;
}

export interface FullReportData {
  summary: SalesReportSummary;
  topProducts: TopProductReport[];
  customerAnalytics: CustomerAnalyticsReport;
  paymentAnalytics: PaymentAnalyticsReport[];
  inventoryAnalytics: InventoryAnalyticsReport;
}
