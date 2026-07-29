export interface DashboardSummary {
  revenueToday: number;
  ordersToday: number;
  averageBasket: number;
  lowStockCount: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: Date;
}

export interface DashboardChartPoint {
  label: string;
  revenue: number;
}

export interface LowStockProduct {
  id: string;
  sku: string;
  name: string;
  supplier?: string;
  binLocation?: string;
  stock: number;
  minimumStock: number;
  costPrice: number;
  status: 'critical' | 'warning';
}

export interface DashboardData {
  summary: DashboardSummary;
  recentOrders: RecentOrder[];
  chart: DashboardChartPoint[];
  lowStockProducts: LowStockProduct[];
}

