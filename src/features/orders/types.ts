export interface OrderItemDetail {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderItemFull {
  id: string;
  receiptNumber: string;
  storeId: string;
  customerId: string | null;
  customerName: string;
  cashierId: string | null;
  cashierName: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  orderStatus: 'draft' | 'completed' | 'cancelled';
  notes: string | null;
  items: OrderItemDetail[];
  createdAt: Date;
  updatedAt: Date;
}
