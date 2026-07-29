import {
  getProducts as getProductsRepo,
  getProductById as getProductByIdRepo,
  createProduct as createProductRepo,
  updateProduct as updateProductRepo,
  toggleProductActive as toggleProductActiveRepo,
  deleteProductSoft as deleteProductSoftRepo,
  getDefaultStoreId
} from "./repository";
import { ProductItem, CreateProductInput, UpdateProductInput } from "./types";

export async function getProductsService(options?: {
  categoryId?: string;
  search?: string;
  activeOnly?: boolean;
}): Promise<ProductItem[]> {
  return await getProductsRepo(options);
}

export async function getProductByIdService(id: string): Promise<ProductItem | null> {
  return await getProductByIdRepo(id);
}

export async function createProductService(input: CreateProductInput): Promise<ProductItem> {
  const storeId = await getDefaultStoreId();
  return await createProductRepo(input, storeId);
}

export async function updateProductService(input: UpdateProductInput): Promise<ProductItem> {
  const existing = await getProductByIdRepo(input.id);
  if (!existing) throw new Error("Product not found");
  return await updateProductRepo(input);
}

export async function toggleProductActiveService(id: string, isActive: boolean): Promise<boolean> {
  return await toggleProductActiveRepo(id, isActive);
}

export async function deleteProductService(id: string): Promise<boolean> {
  return await deleteProductSoftRepo(id);
}
