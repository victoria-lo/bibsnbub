ALTER TABLE "locations" ALTER COLUMN "latitude" SET DATA TYPE numeric(9, 6) USING "latitude"::numeric(9, 6);--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "longitude" SET DATA TYPE numeric(9, 6) USING "longitude"::numeric(9, 6);--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "has_hot_water" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "has_sink" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "has_outlet" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "has_wastebasket" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "has_waiting_area" boolean DEFAULT false;