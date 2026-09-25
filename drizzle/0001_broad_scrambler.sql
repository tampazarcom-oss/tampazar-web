ALTER TABLE "tenants" ADD COLUMN "trial_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "onboarding_status" varchar(32) DEFAULT 'submitted';--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "application_tracking_code" varchar(64);--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "rejection_reason" text;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "kvkk_consent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "commercial_message_consent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "consent_given_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_application_tracking_code_unique" UNIQUE("application_tracking_code");