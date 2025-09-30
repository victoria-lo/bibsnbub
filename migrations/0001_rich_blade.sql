CREATE TABLE "favorites" (
	"user_id" text NOT NULL,
	"location_id" integer NOT NULL,
	CONSTRAINT "favorites_user_id_location_id_pk" PRIMARY KEY("user_id","location_id")
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(3) NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"latitude" text NOT NULL,
	"longitude" text NOT NULL,
	"accessible" boolean DEFAULT false,
	"has_changing_table" boolean DEFAULT false,
	"has_private_nursing_area" boolean DEFAULT false,
	"rating" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"location_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"rating" integer DEFAULT 3 NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "counter" CASCADE;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;