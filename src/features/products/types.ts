export interface ProductItem {
  id: string;
  storeId: string;
  categoryId: string | null;
  categoryName?: string | null;
  sku: string;
  barcode: string | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
  trackStock: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  barcode?: string | null;
  categoryId?: string | null;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
  description?: string | null;
  imageUrl?: string | null;
  trackStock?: boolean;
  isActive?: boolean;
}

export interface UpdateProductInput extends CreateProductInput {
  id: string;
}
