import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './db/schema/index';

/**
 * PostgreSQL client configured for Supabase Drizzle ORM integration.
 * Connection URL is fetched from process.env.DATABASE_URL.
 * Configured with prepare: false for Supabase pooler compatibility.
 */
const rawUrl = process.env.DATABASE_URL || '';
const connectionString = rawUrl.replace(':6543/', ':5432/');

const client = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(client, { schema });
