import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { stores } from "./stores";
import { categories } from "./categories";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, {
        onDelete: "cascade",
      }),

    categoryId: uuid("category_id").references(
      () => categories.id,
      {
        onDelete: "set null",
      }
    ),

    sku: varchar("sku", {
      length: 50,
    }).notNull(),

    barcode: varchar("barcode", {
      length: 100,
    }),

    name: varchar("name", {
      length: 200,
    }).notNull(),

    description: text("description"),

    imageUrl: text("image_url"),

    purchasePrice: numeric("purchase_price", {
      precision: 12,
      scale: 2,
    }).notNull(),

    sellingPrice: numeric("selling_price", {
      precision: 12,
      scale: 2,
    }).notNull(),

    stock: integer("stock")
      .default(0)
      .notNull(),

    minimumStock: integer("minimum_stock")
      .default(0)
      .notNull(),

    trackStock: boolean("track_stock")
      .default(true)
      .notNull(),

    isActive: boolean("is_active")
      .default(true)
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    storeIdx: index("products_store_idx").on(table.storeId),

    categoryIdx: index("products_category_idx").on(
      table.categoryId
    ),

    skuIdx: index("products_sku_idx").on(table.sku),

    barcodeIdx: index("products_barcode_idx").on(
      table.barcode
    ),

    nameIdx: index("products_name_idx").on(table.name),
  })
);