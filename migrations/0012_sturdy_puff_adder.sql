ALTER TABLE "locations" RENAME COLUMN "name" TO "building";--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "latitude" SET DATA TYPE numeric(10, 8) USING "latitude"::numeric(10, 8);--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "longitude" SET DATA TYPE numeric(11, 8) USING "longitude"::numeric(11, 8);--> statement-breakpoint
ALTER TABLE "facilities" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "block" varchar(50);--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "road" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "postal_code" varchar(10);--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "created_at";