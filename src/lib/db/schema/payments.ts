import {
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { orders } from "./orders";

export const paymentRecordStatusEnum = pgEnum("payment_record_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
      }),

    amount: numeric("amount", {
      precision: 12,
      scale: 2,
    }).notNull(),

    method: varchar("method", {
      length: 30,
    }).notNull(),

    reference: varchar("reference", {
      length: 100,
    }),

    status: paymentRecordStatusEnum("status")
      .default("pending")
      .notNull(),

    notes: text("notes"),

    paidAt: timestamp("paid_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orderIdx: index("payments_order_idx").on(table.orderId),

    statusIdx: index("payments_status_idx").on(table.status),

    referenceIdx: index("payments_reference_idx").on(
      table.reference
    ),
  })
);