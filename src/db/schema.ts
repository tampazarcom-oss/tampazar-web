import { pgTable, varchar, text, numeric, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// 1. Tenants (Esnaf & Mağazalar)
export const tenants = pgTable('tenants', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  legalTitle: varchar('legal_title', { length: 255 }),
  taxOffice: varchar('tax_office', { length: 128 }),
  taxId: varchar('tax_id', { length: 32 }),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  plan: varchar('plan', { length: 32 }).default('Starter'),
  subscriptionStatus: varchar('subscription_status', { length: 32 }).default('trial'),
  trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),
  byoPosConnected: boolean('byo_pos_connected').default(false),
  encryptedPosKeys: text('encrypted_pos_keys'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 2. Products (Ürün & Hizmetler)
export const products = pgTable('products', {
  id: varchar('id', { length: 64 }).primaryKey(),
  tenantId: varchar('tenant_id', { length: 64 }).references(() => tenants.id),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  type: varchar('type', { length: 32 }).notNull(), // retail, wholesale, service, digital
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  costPrice: numeric('cost_price', { precision: 12, scale: 2 }),
  vatRate: integer('vat_rate').default(20),
  sku: varchar('sku', { length: 64 }).notNull(),
  stock: integer('stock').default(0),
  salesCount: integer('sales_count').default(0),
  rating: numeric('rating', { precision: 3, scale: 2 }).default('0.00'),
  imageUrl: text('image_url'),
  category: varchar('category', { length: 128 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// 3. Orders (Siparişler)
export const orders = pgTable('orders', {
  id: varchar('id', { length: 64 }).primaryKey(),
  orderNumber: varchar('order_number', { length: 64 }).unique().notNull(),
  tenantId: varchar('tenant_id', { length: 64 }).references(() => tenants.id),
  customerId: varchar('customer_id', { length: 64 }),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  vatTotal: numeric('vat_total', { precision: 12, scale: 2 }).notNull(),
  deliveryFee: numeric('delivery_fee', { precision: 12, scale: 2 }).default('0.00'),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 32 }).default('PENDING'),
  orderStatus: varchar('order_status', { length: 32 }).default('draft'),
  idempotencyKey: varchar('idempotency_key', { length: 128 }).unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});
