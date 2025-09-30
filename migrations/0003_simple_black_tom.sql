CREATE TABLE "amenities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"location_id" integer NOT NULL,
	"facility_type_id" integer NOT NULL,
	"floor" varchar(50),
	"is_accessible" boolean DEFAULT false,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "facility_amenities" (
	"facility_id" integer NOT NULL,
	"amenity_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "facility_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "favorites" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "reviews" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "favorites" CASCADE;--> statement-breakpoint
DROP TABLE "reviews" CASCADE;--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_facility_type_id_facility_types_id_fk" FOREIGN KEY ("facility_type_id") REFERENCES "public"."facility_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facility_amenities" ADD CONSTRAINT "facility_amenities_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facility_amenities" ADD CONSTRAINT "facility_amenities_amenity_id_amenities_id_fk" FOREIGN KEY ("amenity_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "accessible";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "has_changing_table";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "has_private_nursing_area";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "has_hot_water";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "has_sink";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "has_outlet";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "has_wastebasket";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "has_waiting_area";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "rating";