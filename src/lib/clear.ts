import { db, dbClient } from '@/libs/DB';
import {
  amenities,
  facilities,
  facilityAmenities,
  facilityTypes,
  locations,
} from '@/models/Schema';
import { sql } from 'drizzle-orm';

async function resetSequences() {
  await db.execute(sql`ALTER SEQUENCE locations_id_seq RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE facility_types_id_seq RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE amenities_id_seq RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE facilities_id_seq RESTART WITH 1`);
}

async function seed() {
  console.warn('🧼 Clearing tables...');
  // Delete in child-to-parent order
  await db.delete(facilityAmenities);
  await db.delete(facilities);
  await db.delete(facilityTypes);
  await db.delete(amenities);
  await db.delete(locations);

  await resetSequences();

  console.warn('✅ Data cleared successfully!');
  console.warn('ℹ️ If you uploaded images via the Add Facility flow, clear your app browser storage before testing again:');
  console.warn('   - In the browser devtools: Application > Storage > Clear site data');
  console.warn('   - Or manually remove sessionStorage key: \'add-facility-form\'');
  try {
    await dbClient?.end?.();
  } catch {}
  process.exit(0);
}
seed().catch((err) => {
  console.error('❌ Clearing data failed:', err);
  try {
    dbClient?.end?.();
  } catch {}
  process.exit(1);
});
