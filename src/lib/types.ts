export type ViewType = 
  | 'dashboard'
  | 'counter'
  | 'orders'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'customers'
  | 'reports'
  | 'store'
  | 'users'
  | 'settings';

export interface Product {
  price?: number;
  id: string;
  sku: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  marginPercent: number;
  stock: number;
  reorderThreshold: number;
  barcode: string;
  binLocation: string;
  supplier: string;
  imageUrl: string;
}

export interface RestockItem {
  id: string;
  sku: string;
  name: string;
  supplier: string;
  supplierEmail: string;
  binLocation: string;
  currentStock: number;
  reorderPoint: number;
  costPerUnit: number;
  suggestedQty: number;
  status: 'critical' | 'warning' | 'ordered';
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
  variant?: string;
}

export interface Order {
  id: string;
  receiptNumber: string;
  timestamp: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'card' | 'apple_pay' | 'cash' | 'split';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  registerId: string;
  cashierName: string;
}

export interface InventoryMovement {
  id: string;
  timestamp: string;
  sku: string;
  productName: string;
  type: 'sale' | 'restock' | 'adjustment' | 'return';
  quantityDelta: number;
  remainingStock: number;
  binLocation: string;
  operator: string;
  referenceId: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  tier: 'Standard' | 'Silver' | 'Gold' | 'VIP';
  totalSpend: number;
  totalOrders: number;
  lastVisit: string;
}

export interface SalesMetricPoint {
  time: string;
  posRevenue: number;
  onlineRevenue: number;
}
