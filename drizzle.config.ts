import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Load environment variables from .env.local for drizzle-kit CLI commands
config({ path: '.env.local' });

// Use Port 5432 (Session Pooler) for instant CLI schema introspection
const dbUrl = (process.env.DATABASE_URL || '').replace(':6543/', ':5432/');

export default defineConfig({
  schema: './lib/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: {
    url: dbUrl,
  },
});
