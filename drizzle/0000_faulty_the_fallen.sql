CREATE TYPE "public"."user_role" AS ENUM('owner', 'cashier');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('draft', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'card', 'transfer', 'ewallet');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_record_status" AS ENUM('pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."movement_type" AS ENUM('purchase', 'sale', 'adjustment', 'return');--> statement-breakpoint
CREATE TABLE "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(30),
	"logo" text,
	"currency" varchar(10) DEFAULT 'IDR' NOT NULL,
	"timezone" varchar(50) DEFAULT 'Asia/Jakarta' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stores_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"auth_user_id" varchar(255),
	"name" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL,
	"avatar" varchar(500),
	"role" "user_role" DEFAULT 'cashier' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_auth_user_id_unique" UNIQUE("auth_user_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"category_id" uuid,
	"sku" varchar(50) NOT NULL,
	"barcode" varchar(100),
	"name" varchar(200) NOT NULL,
	"description" text,
	"image_url" text,
	"purchase_price" numeric(12, 2) NOT NULL,
	"selling_price" numeric(12, 2) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"minimum_stock" integer DEFAULT 0 NOT NULL,
	"track_stock" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"name" varchar(150) NOT NULL,
	"phone" varchar(30),
	"email" varchar(255),
	"address" text,
	"notes" text,
	"loyalty_points" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"receipt_number" varchar(50) NOT NULL,
	"store_id" uuid NOT NULL,
	"customer_id" uuid,
	"cashier_id" uuid NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"discount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"tax" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"order_status" "order_status" DEFAULT 'draft' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_receipt_number_unique" UNIQUE("receipt_number")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"product_name" varchar(200) NOT NULL,
	"product_sku" varchar(50) NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"method" varchar(30) NOT NULL,
	"reference" varchar(100),
	"status" "payment_record_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"user_id" uuid,
	"type" "movement_type" NOT NULL,
	"quantity" integer NOT NULL,
	"previous_stock" integer NOT NULL,
	"current_stock" integer NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_cashier_id_users_id_fk" FOREIGN KEY ("cashier_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "stores_slug_idx" ON "stores" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "stores_email_idx" ON "stores" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_store_idx" ON "users" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_auth_idx" ON "users" USING btree ("auth_user_id");--> statement-breakpoint
CREATE INDEX "categories_store_idx" ON "categories" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "categories_name_idx" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "products_store_idx" ON "products" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_sku_idx" ON "products" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "products_barcode_idx" ON "products" USING btree ("barcode");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "customers_store_idx" ON "customers" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "customers_phone_idx" ON "customers" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "customers_email_idx" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "orders_receipt_idx" ON "orders" USING btree ("receipt_number");--> statement-breakpoint
CREATE INDEX "orders_store_idx" ON "orders" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "orders_cashier_idx" ON "orders" USING btree ("cashier_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("order_status");--> statement-breakpoint
CREATE INDEX "orders_payment_status_idx" ON "orders" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_product_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "order_items_sku_idx" ON "order_items" USING btree ("product_sku");--> statement-breakpoint
CREATE INDEX "payments_order_idx" ON "payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payments_reference_idx" ON "payments" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "stock_product_idx" ON "stock_movements" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_user_idx" ON "stock_movements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stock_type_idx" ON "stock_movements" USING btree ("type");