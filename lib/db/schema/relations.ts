import { relations } from "drizzle-orm";

import { stores } from "./stores";
import { users } from "./users";
import { categories } from "./categories";
import { products } from "./products";
import { customers } from "./customers";
import { orders } from "./orders";
import { orderItems } from "./order-items";
import { payments } from "./payments";
import { stockMovements } from "./stock-movements";

//
// Store
//

export const storeRelations = relations(stores, ({ many }) => ({
  users: many(users),
  categories: many(categories),
  products: many(products),
  customers: many(customers),
  orders: many(orders),
}));

//
// User
//

export const userRelations = relations(users, ({ one, many }) => ({
  store: one(stores, {
    fields: [users.storeId],
    references: [stores.id],
  }),

  orders: many(orders),

  stockMovements: many(stockMovements),
}));

//
// Category
//

export const categoryRelations = relations(categories, ({ one, many }) => ({
  store: one(stores, {
    fields: [categories.storeId],
    references: [stores.id],
  }),

  products: many(products),
}));

//
// Product
//

export const productRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),

  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),

  orderItems: many(orderItems),

  stockMovements: many(stockMovements),
}));

//
// Customer
//

export const customerRelations = relations(customers, ({ one, many }) => ({
  store: one(stores, {
    fields: [customers.storeId],
    references: [stores.id],
  }),

  orders: many(orders),
}));

//
// Order
//

export const orderRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),

  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),

  cashier: one(users, {
    fields: [orders.cashierId],
    references: [users.id],
  }),

  items: many(orderItems),

  payments: many(payments),
}));

//
// Order Item
//

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),

  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

//
// Payment
//

export const paymentRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

//
// Stock Movement
//

export const stockMovementRelations = relations(
  stockMovements,
  ({ one }) => ({
    product: one(products, {
      fields: [stockMovements.productId],
      references: [products.id],
    }),

    user: one(users, {
      fields: [stockMovements.userId],
      references: [users.id],
    }),
  })
);