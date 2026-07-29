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

import { customers } from "./customers";
import { stores } from "./stores";
import { users } from "./users";

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "card",
  "transfer",
  "ewallet",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "refunded",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "draft",
  "completed",
  "cancelled",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    receiptNumber: varchar("receipt_number", {
      length: 50,
    })
      .notNull()
      .unique(),

    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, {
        onDelete: "cascade",
      }),

    customerId: uuid("customer_id").references(
      () => customers.id,
      {
        onDelete: "set null",
      }
    ),

    cashierId: uuid("cashier_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    subtotal: numeric("subtotal", {
      precision: 12,
      scale: 2,
    }).notNull(),

    discount: numeric("discount", {
      precision: 12,
      scale: 2,
    })
      .default("0")
      .notNull(),

    tax: numeric("tax", {
      precision: 12,
      scale: 2,
    })
      .default("0")
      .notNull(),

    total: numeric("total", {
      precision: 12,
      scale: 2,
    }).notNull(),

    paymentMethod: paymentMethodEnum("payment_method")
      .notNull(),

    paymentStatus: paymentStatusEnum("payment_status")
      .default("pending")
      .notNull(),

    orderStatus: orderStatusEnum("order_status")
      .default("draft")
      .notNull(),

    notes: text("notes"),

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
    receiptIdx: index("orders_receipt_idx").on(
      table.receiptNumber
    ),

    storeIdx: index("orders_store_idx").on(
      table.storeId
    ),

    customerIdx: index("orders_customer_idx").on(
      table.customerId
    ),

    cashierIdx: index("orders_cashier_idx").on(
      table.cashierId
    ),

    statusIdx: index("orders_status_idx").on(
      table.orderStatus
    ),

    paymentStatusIdx: index("orders_payment_status_idx").on(
      table.paymentStatus
    ),
  })
);