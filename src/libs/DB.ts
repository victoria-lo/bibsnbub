import * as schema from '@/models/Schema';
import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { migrate as migratePg } from 'drizzle-orm/node-postgres/migrator';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import pg from 'pg';
import { Env } from './Env';

const { Client } = pg;

let client: any;
let drizzle: any;

const isProduction = Env.NODE_ENV === 'production';

if (isProduction) {
  // In production we require a DATABASE_URL (e.g. Supabase).
  if (!Env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing in production.');
  }

  client = new Client({ connectionString: Env.DATABASE_URL });
  await client.connect();
  drizzle = drizzlePg(client, { schema });
  // Do not auto-migrate in production; use dedicated migration commands.
} else {
  // Local development / tests: prefer PGlite if DATABASE_URL is not provided.
  if (Env.DATABASE_URL) {
    client = new Client({ connectionString: Env.DATABASE_URL });
    await client.connect();
    drizzle = drizzlePg(client, { schema });
    await migratePg(drizzle, { migrationsFolder: './migrations' });
  } else {
    const dataDir = Env.PGLITE_DATA_DIR || '.pglite-data';
    client = new PGlite({ dataDir });
    drizzle = drizzlePglite({ client, schema });
    await migratePglite(drizzle, { migrationsFolder: './migrations' });
  }
}

export const db = drizzle;
export const dbClient = client;
