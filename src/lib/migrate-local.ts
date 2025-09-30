import { db, dbClient } from '@/libs/DB';

async function main() {
  // Importing db from DB.ts will automatically run migrations in non-production.
  console.warn('🔄 Running local migrations (PGlite or local Postgres)...');
  // Simple no-op query to ensure the connection was established
  await db.execute('select 1');
  console.warn('✅ Local migrations complete.');
  await dbClient?.end?.();
}

main().catch(async (err) => {
  console.error('❌ Local migration failed:', err);
  try {
    await dbClient?.end?.();
  } catch {}
  process.exit(1);
});
