import { 
  getCategories as getCategoriesRepo,
  getCategoryById as getCategoryByIdRepo,
  createCategory as createCategoryRepo,
  updateCategory as updateCategoryRepo,
  deleteCategory as deleteCategoryRepo,
  getDefaultStoreId
} from "./repository";
import { CategoryItem, CreateCategoryInput, UpdateCategoryInput } from "./types";

export async function getCategoriesService(): Promise<CategoryItem[]> {
  return await getCategoriesRepo();
}

export async function createCategoryService(input: CreateCategoryInput): Promise<CategoryItem> {
  const storeId = await getDefaultStoreId();
  return await createCategoryRepo(input, storeId);
}

export async function updateCategoryService(input: UpdateCategoryInput): Promise<CategoryItem> {
  const existing = await getCategoryByIdRepo(input.id);
  if (!existing) {
    throw new Error("Category not found");
  }
  return await updateCategoryRepo(input);
}

export async function deleteCategoryService(id: string): Promise<boolean> {
  const existing = await getCategoryByIdRepo(id);
  if (!existing) {
    throw new Error("Category not found");
  }
  return await deleteCategoryRepo(id);
}
