import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const stores = pgTable(
  "stores",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 150 }).notNull(),

    slug: varchar("slug", { length: 150 }).notNull().unique(),

    email: varchar("email", { length: 255 }).notNull(),

    phone: varchar("phone", { length: 30 }),

    logo: text("logo"),

    currency: varchar("currency", { length: 10 })
      .default("IDR")
      .notNull(),

    timezone: varchar("timezone", { length: 50 })
      .default("Asia/Jakarta")
      .notNull(),

    isActive: boolean("is_active").default(true).notNull(),

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
    slugIdx: index("stores_slug_idx").on(table.slug),
    emailIdx: index("stores_email_idx").on(table.email),
  })
);