import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';

/**
 * PostgreSQL client configured for Supabase/Neon Drizzle ORM integration.
 * Connection URL is fetched from process.env.DATABASE_URL.
 * Configured with prepare: false for Supabase pooler compatibility.
 * Fast connection timeout (3s) to prevent browser loading stalls.
 */
const connectionString = process.env.DATABASE_URL || '';

const client = postgres(connectionString, {
  prepare: false,
  ssl: 'require',
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
