import {
  index,
  integer,
  numeric,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { orders } from "./orders";
import { products } from "./products";

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
      }),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "restrict",
      }),

    productName: varchar("product_name", {
      length: 200,
    }).notNull(),

    productSku: varchar("product_sku", {
      length: 50,
    }).notNull(),

    quantity: integer("quantity")
      .notNull(),

    price: numeric("price", {
      precision: 12,
      scale: 2,
    }).notNull(),

    subtotal: numeric("subtotal", {
      precision: 12,
      scale: 2,
    }).notNull(),
  },
  (table) => ({
    orderIdx: index("order_items_order_idx").on(
      table.orderId
    ),

    productIdx: index("order_items_product_idx").on(
      table.productId
    ),

    skuIdx: index("order_items_sku_idx").on(
      table.productSku
    ),
  })
);