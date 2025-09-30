ALTER TABLE "facilities" ALTER COLUMN "created_by" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "facilities" ADD COLUMN "females_only" boolean DEFAULT false;