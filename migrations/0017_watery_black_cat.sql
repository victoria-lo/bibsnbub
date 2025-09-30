ALTER TABLE "facility_types" ADD COLUMN "slug" varchar(255);--> statement-breakpoint
ALTER TABLE "facility_types" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "facility_types" ADD COLUMN "order" integer DEFAULT 0;