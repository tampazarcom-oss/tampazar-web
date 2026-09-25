CREATE TABLE "order_audit_logs" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"order_id" varchar(64) NOT NULL,
	"previous_status" varchar(32),
	"new_status" varchar(32) NOT NULL,
	"triggered_by" varchar(64) NOT NULL,
	"details" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"order_number" varchar(64) NOT NULL,
	"tenant_id" varchar(64),
	"customer_id" varchar(64),
	"subtotal" numeric(12, 2) NOT NULL,
	"vat_total" numeric(12, 2) NOT NULL,
	"delivery_fee" numeric(12, 2) DEFAULT '0.00',
	"total_amount" numeric(12, 2) NOT NULL,
	"payment_status" varchar(32) DEFAULT 'PENDING',
	"order_status" varchar(32) DEFAULT 'draft',
	"idempotency_key" varchar(128),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number"),
	CONSTRAINT "orders_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(64),
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" varchar(32) NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"cost_price" numeric(12, 2),
	"vat_rate" integer DEFAULT 20,
	"sku" varchar(64) NOT NULL,
	"stock" integer DEFAULT 0,
	"sales_count" integer DEFAULT 0,
	"rating" numeric(3, 2) DEFAULT '0.00',
	"image_url" text,
	"category" varchar(128),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"legal_title" varchar(255),
	"tax_office" varchar(128),
	"tax_id" varchar(32),
	"slug" varchar(255) NOT NULL,
	"plan" varchar(32) DEFAULT 'Starter',
	"subscription_status" varchar(32) DEFAULT 'trial',
	"trial_ends_at" timestamp with time zone,
	"byo_pos_connected" boolean DEFAULT false,
	"encrypted_pos_keys" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "tenants_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "order_audit_logs" ADD CONSTRAINT "order_audit_logs_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;