import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { products } from "./products";
import { users } from "./users";

export const movementTypeEnum = pgEnum("movement_type", [
  "purchase",
  "sale",
  "adjustment",
  "return",
]);

export const stockMovements = pgTable(
  "stock_movements",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),

    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "set null",
      }),

    type: movementTypeEnum("type").notNull(),

    quantity: integer("quantity").notNull(),

    previousStock: integer("previous_stock").notNull(),

    currentStock: integer("current_stock").notNull(),

    notes: text("notes"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    productIdx: index("stock_product_idx").on(
      table.productId
    ),

    userIdx: index("stock_user_idx").on(
      table.userId
    ),

    typeIdx: index("stock_type_idx").on(
      table.type
    ),
  })
);