import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { stores } from "./stores";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, {
        onDelete: "cascade",
      }),

    name: varchar("name", {
      length: 100,
    }).notNull(),

    description: text("description"),

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
    storeIdx: index("categories_store_idx").on(table.storeId),
    nameIdx: index("categories_name_idx").on(table.name),
  })
);