-- Add slug, description, and order columns to facility_types
ALTER TABLE "facility_types"
  ADD COLUMN IF NOT EXISTS "slug" varchar(255),
  ADD COLUMN IF NOT EXISTS "description" text,
  ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0;

-- Optional: ensure slug is unique if provided
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = ANY (current_schemas(false))
      AND indexname = 'facility_types_slug_unique'
  ) THEN
    CREATE UNIQUE INDEX facility_types_slug_unique ON "facility_types" ("slug") WHERE slug IS NOT NULL;
  END IF;
END $$;
