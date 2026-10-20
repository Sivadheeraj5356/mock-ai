import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'

// Server-only. Never prefix this env var with NEXT_PUBLIC_ and never import
// this module from a client component: the connection string carries the
// database password.
const sql = neon(process.env.DRIZZLE_DB_URL);
export const db = drizzle(sql, { schema });
