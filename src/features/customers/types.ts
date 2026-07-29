export interface CustomerItem {
  id: string;
  storeId: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  loyaltyPoints: number;
  totalOrders: number;
  totalSpend: number;
  tier: 'Standard' | 'Silver' | 'Gold' | 'VIP';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
}

export interface UpdateCustomerInput extends CreateCustomerInput {
  id: string;
}
