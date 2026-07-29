import { db } from "@/lib/db/db";
import { products } from "@/lib/db/schema/products";
import { categories } from "@/lib/db/schema/categories";
import { stores } from "@/lib/db/schema/stores";
import { eq, desc, and, ilike, or } from "drizzle-orm";
import { ProductItem, CreateProductInput, UpdateProductInput } from "./types";

export async function getDefaultStoreId(): Promise<string> {
  try {
    const storeList = await db.select({ id: stores.id }).from(stores).limit(1);
    if (storeList.length > 0) return storeList[0].id;
    const [newStore] = await db.insert(stores).values({
      name: "SoHo Flagship Store",
      slug: "soho-flagship",
      email: "admin@counter-relay.com"
    }).returning({ id: stores.id });
    return newStore.id;
  } catch (error) {
    return "00000000-0000-0000-0000-000000000001";
  }
}

export async function getProducts(options?: {
  categoryId?: string;
  search?: string;
  activeOnly?: boolean;
}): Promise<ProductItem[]> {
  try {
    const conditions = [];

    if (options?.categoryId && options.categoryId !== "all") {
      conditions.push(eq(products.categoryId, options.categoryId));
    }
    if (options?.activeOnly) {
      conditions.push(eq(products.isActive, true));
    }
    if (options?.search) {
      const query = `%${options.search}%`;
      conditions.push(
        or(
          ilike(products.name, query),
          ilike(products.sku, query),
          ilike(products.barcode, query)
        )
      );
    }

    const rows = await db
      .select({
        id: products.id,
        storeId: products.storeId,
        categoryId: products.categoryId,
        categoryName: categories.name,
        sku: products.sku,
        barcode: products.barcode,
        name: products.name,
        description: products.description,
        imageUrl: products.imageUrl,
        purchasePrice: products.purchasePrice,
        sellingPrice: products.sellingPrice,
        stock: products.stock,
        minimumStock: products.minimumStock,
        trackStock: products.trackStock,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(products.createdAt));

    return rows.map(r => ({
      ...r,
      purchasePrice: Number(r.purchasePrice),
      sellingPrice: Number(r.sellingPrice),
    }));
  } catch (error) {
    console.warn("Failed to fetch products from DB:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<ProductItem | null> {
  try {
    const rows = await db
      .select({
        id: products.id,
        storeId: products.storeId,
        categoryId: products.categoryId,
        categoryName: categories.name,
        sku: products.sku,
        barcode: products.barcode,
        name: products.name,
        description: products.description,
        imageUrl: products.imageUrl,
        purchasePrice: products.purchasePrice,
        sellingPrice: products.sellingPrice,
        stock: products.stock,
        minimumStock: products.minimumStock,
        trackStock: products.trackStock,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .where(eq(products.id, id))
      .limit(1);

    if (!rows[0]) return null;

    return {
      ...rows[0],
      purchasePrice: Number(rows[0].purchasePrice),
      sellingPrice: Number(rows[0].sellingPrice),
    };
  } catch (error) {
    console.warn("Failed to fetch product by ID:", error);
    return null;
  }
}

export async function createProduct(input: CreateProductInput, storeId: string): Promise<ProductItem> {
  const [created] = await db
    .insert(products)
    .values({
      storeId,
      categoryId: input.categoryId || null,
      sku: input.sku,
      barcode: input.barcode || null,
      name: input.name,
      description: input.description || null,
      imageUrl: input.imageUrl || null,
      purchasePrice: input.purchasePrice.toString(),
      sellingPrice: input.sellingPrice.toString(),
      stock: input.stock,
      minimumStock: input.minimumStock,
      trackStock: input.trackStock ?? true,
      isActive: input.isActive ?? true,
    })
    .returning();

  return {
    ...created,
    purchasePrice: Number(created.purchasePrice),
    sellingPrice: Number(created.sellingPrice),
  };
}

export async function updateProduct(input: UpdateProductInput): Promise<ProductItem> {
  const [updated] = await db
    .update(products)
    .set({
      categoryId: input.categoryId || null,
      sku: input.sku,
      barcode: input.barcode || null,
      name: input.name,
      description: input.description || null,
      imageUrl: input.imageUrl || null,
      purchasePrice: input.purchasePrice.toString(),
      sellingPrice: input.sellingPrice.toString(),
      stock: input.stock,
      minimumStock: input.minimumStock,
      trackStock: input.trackStock ?? true,
      isActive: input.isActive ?? true,
      updatedAt: new Date(),
    })
    .where(eq(products.id, input.id))
    .returning();

  return {
    ...updated,
    purchasePrice: Number(updated.purchasePrice),
    sellingPrice: Number(updated.sellingPrice),
  };
}

export async function toggleProductActive(id: string, isActive: boolean): Promise<boolean> {
  const [updated] = await db
    .update(products)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning({ id: products.id });

  return !!updated;
}

export async function deleteProductSoft(id: string): Promise<boolean> {
  return await toggleProductActive(id, false);
}
