import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { stores } from "./stores";

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, {
        onDelete: "cascade",
      }),

    name: varchar("name", {
      length: 150,
    }).notNull(),

    phone: varchar("phone", {
      length: 30,
    }),

    email: varchar("email", {
      length: 255,
    }),

    address: text("address"),

    notes: text("notes"),

    loyaltyPoints: integer("loyalty_points")
      .default(0)
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
    storeIdx: index("customers_store_idx").on(table.storeId),

    phoneIdx: index("customers_phone_idx").on(table.phone),

    emailIdx: index("customers_email_idx").on(table.email),
  })
);