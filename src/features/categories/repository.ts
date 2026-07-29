import { db } from "@/lib/db/db";
import { categories } from "@/lib/db/schema/categories";
import { stores } from "@/lib/db/schema/stores";
import { products } from "@/lib/db/schema/products";
import { eq, desc, sql } from "drizzle-orm";
import { CategoryItem, CreateCategoryInput, UpdateCategoryInput } from "./types";

export async function getDefaultStoreId(): Promise<string> {
  try {
    const storeList = await db.select({ id: stores.id }).from(stores).limit(1);
    if (storeList.length > 0) {
      return storeList[0].id;
    }
    const [newStore] = await db.insert(stores).values({
      name: "SoHo Flagship Store",
      slug: "soho-flagship",
      email: "admin@counter-relay.com"
    }).returning({ id: stores.id });
    return newStore.id;
  } catch (error) {
    console.warn("Could not query or create store in DB, fallback uuid used:", error);
    return "00000000-0000-0000-0000-000000000001";
  }
}

export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const rows = await db
      .select({
        id: categories.id,
        storeId: categories.storeId,
        name: categories.name,
        description: categories.description,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        productCount: sql<number>`CAST(COUNT(${products.id}) AS INTEGER)`
      })
      .from(categories)
      .leftJoin(products, eq(products.categoryId, categories.id))
      .groupBy(
        categories.id,
        categories.storeId,
        categories.name,
        categories.description,
        categories.createdAt,
        categories.updatedAt
      )
      .orderBy(desc(categories.createdAt));

    return rows;
  } catch (error) {
    console.warn("Failed to fetch categories from DB:", error);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<CategoryItem | null> {
  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!rows[0]) return null;

    return {
      ...rows[0],
      productCount: 0
    };
  } catch (error) {
    console.warn("Failed to fetch category by id from DB:", error);
    return null;
  }
}

export async function createCategory(input: CreateCategoryInput, storeId: string): Promise<CategoryItem> {
  const [created] = await db
    .insert(categories)
    .values({
      storeId,
      name: input.name,
      description: input.description || null,
    })
    .returning();

  return {
    ...created,
    productCount: 0,
  };
}

export async function updateCategory(input: UpdateCategoryInput): Promise<CategoryItem> {
  const [updated] = await db
    .update(categories)
    .set({
      name: input.name,
      description: input.description || null,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, input.id))
    .returning();

  return {
    ...updated,
  };
}

export async function deleteCategory(id: string): Promise<boolean> {
  const result = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning({ id: categories.id });

  return result.length > 0;
}
