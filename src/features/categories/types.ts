export interface CategoryItem {
  id: string;
  storeId: string;
  name: string;
  description: string | null;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  id: string;
  name: string;
  description?: string;
}
