import fs from 'node:fs/promises';
import path from 'node:path';
import { db, dbClient } from '@/libs/DB';
import { amenities, facilityTypes } from '@/models/Schema';
import { eq } from 'drizzle-orm';

async function loadJSON<T>(filename: string): Promise<T> {
  const filePath = path.join(process.cwd(), 'src/data', filename);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function seedProd() {
  console.warn('🌱 Seeding (prod) facility types and amenities...');

  const facilityTypeData = await loadJSON<typeof facilityTypes.$inferInsert[]>('facilityTypes.json');
  const amenityData = await loadJSON<typeof amenities.$inferInsert[]>('amenities.json');

  await db.transaction(async (tx: any) => {
    // Upsert facility types by name (no DB unique constraint, so do manual check)
    for (const ft of facilityTypeData) {
      const existing = await tx.select().from(facilityTypes).where(eq(facilityTypes.name, ft.name)).limit(1);
      if (existing.length > 0) {
        await tx
          .update(facilityTypes)
          .set({
            slug: ft.slug ?? existing[0].slug ?? null,
            description: ft.description ?? existing[0].description ?? null,
            order: typeof ft.order === 'number' ? ft.order : existing[0].order ?? 0,
          })
          .where(eq(facilityTypes.id, existing[0].id));
      } else {
        await tx.insert(facilityTypes).values(ft);
      }
    }

    // Upsert amenities by name
    for (const am of amenityData) {
      const existing = await tx.select().from(amenities).where(eq(amenities.name, am.name)).limit(1);
      if (existing.length > 0) {
        await tx
          .update(amenities)
          .set({
            description: am.description ?? existing[0].description ?? null,
            isMultipleApplicable:
              typeof am.isMultipleApplicable === 'boolean'
                ? am.isMultipleApplicable
                : existing[0].isMultipleApplicable ?? true,
          })
          .where(eq(amenities.id, existing[0].id));
      } else {
        await tx.insert(amenities).values(am);
      }
    }
  });

  console.warn('✅ Prod seed completed for facility types and amenities.');
  try {
    await dbClient?.end?.();
  } catch {}
  process.exit(0);
}

seedProd().catch(async (err) => {
  console.error('❌ Prod seeding failed:', err);
  try {
    await dbClient?.end?.();
  } catch {}
  process.exit(1);
});
