import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

import { stores } from "./stores";

export const userRoleEnum = pgEnum("user_role", [
  "owner",
  "cashier",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, {
        onDelete: "cascade",
      }),

    authUserId: varchar("auth_user_id", {
      length: 255,
    }).unique(),

    name: varchar("name", {
      length: 150,
    }).notNull(),

    email: varchar("email", {
      length: 255,
    }).notNull(),

    avatar: varchar("avatar", {
      length: 500,
    }),

    role: userRoleEnum("role")
      .default("cashier")
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
    storeIdx: index("users_store_idx").on(table.storeId),
    emailIdx: index("users_email_idx").on(table.email),
    authIdx: index("users_auth_idx").on(table.authUserId),
  })
);