import { ProductItem } from "@/features/products/types";
import { CustomerItem } from "@/features/customers/types";

export interface CartItem {
  product: ProductItem;
  quantity: number;
  subtotal: number;
}

export interface CheckoutInput {
  customerId?: string | null;
  items: {
    productId: string;
    productName: string;
    productSku: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: "cash" | "card" | "transfer" | "ewallet";
  amountPaid: number;
  change: number;
  notes?: string | null;
}

export interface CompletedOrderReceipt {
  orderId: string;
  receiptNumber: string;
  storeName: string;
  cashierName: string;
  customerName?: string;
  items: {
    name: string;
    sku: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  createdAt: Date;
}
