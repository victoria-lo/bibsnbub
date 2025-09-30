ALTER TABLE "amenities" ADD COLUMN "is_multiple_applicable" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "facility_amenities" ADD COLUMN "quantity" integer DEFAULT 1 NOT NULL;