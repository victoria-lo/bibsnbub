import fs from 'node:fs/promises';
import path from 'node:path';
import { db, dbClient } from '@/libs/DB';
import {
  amenities,
  facilities,
  facilityAmenities,
  facilityTypes,
  locations,
} from '@/models/Schema';

async function loadJSON<T>(filename: string): Promise<T> {
  const filePath = path.join(process.cwd(), 'src/data', filename);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

type FacilitySeed = {
  locationAddress: string;
  facilityTypeName: string;
  floor?: string;
  description?: string | null;
  hasDiaperChangingStation?: boolean;
  hasLactationRoom?: boolean;
};

type FacilityAmenitySeed = {
  facilityDesc: string;
  amenities: { name: string; quantity: number }[];
};

async function seed() {
  console.warn('🌱 Seeding data...');

  const locationData = await loadJSON<typeof locations.$inferInsert[]>('locations.json');
  const insertedLocations = await db.insert(locations).values(locationData).returning();
  const locationMap = Object.fromEntries(
    insertedLocations.map((l: typeof locations.$inferSelect) => [l.address, l.id]),
  );

  // Refresh facility_types
  const facilityTypeData = await loadJSON<typeof facilityTypes.$inferInsert[]>('facilityTypes.json');
  await db.delete(facilityTypes);
  const insertedTypes = await db.insert(facilityTypes).values(facilityTypeData).returning();
  const typeMap = Object.fromEntries(
    insertedTypes.map((t: typeof facilityTypes.$inferSelect) => [t.name, t.id]),
  );

  const amenityData = await loadJSON<typeof amenities.$inferInsert[]>('amenities.json');
  const insertedAmenities = await db.insert(amenities).values(amenityData).returning();
  const amenityMap = Object.fromEntries(
    insertedAmenities.map((a: typeof amenities.$inferSelect) => [a.name, a.id]),
  );

  const facilityData = await loadJSON<FacilitySeed[]>('facilities.json');
  const facilitiesToInsert: typeof facilities.$inferInsert[] = facilityData
    .map((f): typeof facilities.$inferInsert | null => {
      const locationId = locationMap[f.locationAddress];
      const facilityTypeId = typeMap[f.facilityTypeName];

      if (locationId === undefined) {
        console.error(`Unknown locationAddress: ${f.locationAddress}`);
      }
      if (facilityTypeId === undefined) {
        console.error(`Unknown facilityTypeName: ${f.facilityTypeName}`);
      }

      return locationId !== undefined && facilityTypeId !== undefined
        ? ({
            locationId,
            facilityTypeId,
            floor: f.floor,
            description: f.description ?? null,
            hasDiaperChangingStation: f.hasDiaperChangingStation ?? false,
            hasLactationRoom: f.hasLactationRoom ?? false,
            createdBy: 'system',
          } as typeof facilities.$inferInsert)
        : null;
    })
    .filter((f): f is NonNullable<typeof f> => f !== null); // type guard

  const insertedFacilities = await db.insert(facilities).values(facilitiesToInsert).returning();

  const facilityMap = Object.fromEntries(
    insertedFacilities.map((f: typeof facilities.$inferSelect) => [f.description, f.id]),
  );

  const facilityAmenityData = await loadJSON<FacilityAmenitySeed[]>('facilityAmenities.json');
  const faInserts: typeof facilityAmenities.$inferInsert[] = facilityAmenityData.flatMap(f =>
    f.amenities
      .map(a => ({
        facilityId: facilityMap[f.facilityDesc],
        amenityId: amenityMap[a.name],
        quantity: a.quantity,
      }))
      .filter(
        (x): x is { facilityId: number; amenityId: number; quantity: number } =>
          typeof x.facilityId === 'number' && typeof x.amenityId === 'number',
      ),
  );
  if (faInserts.length > 0) {
    await db.insert(facilityAmenities).values(faInserts);
  } else {
    console.warn('⚠️ No facility_amenities to insert. Skipping.');
  }

  console.warn('✅ Seed data inserted successfully!');
  try {
    await dbClient?.end?.();
  } catch {}
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  try {
    dbClient?.end?.();
  } catch {}
  process.exit(1);
});
