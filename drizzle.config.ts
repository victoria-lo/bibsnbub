import { defineConfig } from 'drizzle-kit';

const isProd = process.env.NODE_ENV === 'production';
const usePglite = !isProd && !process.env.DATABASE_URL;

export default defineConfig({
  out: './migrations',
  schema: './src/models/Schema.ts',
  dialect: 'postgresql',
  ...(usePglite
    ? {
        driver: 'pglite' as const,
        dbCredentials: {
          // Point Studio at the SAME place our runtime PGlite uses
          // so Studio shows the same data
          url: process.env.PGLITE_DATA_DIR || '.pglite-data',
        },
      }
    : {
        dbCredentials: {
          url: process.env.DATABASE_URL ?? '',
        },
      }),
  verbose: true,
  strict: true,
});
