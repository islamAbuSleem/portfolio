import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Configures Neon to use WebSockets for connection pooling if needed, 
// but for HTTP (stateless) queries, the standard neon driver is fine.
// Note: @neondatabase/serverless driver is designed for serverless environments.

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql as any, { schema });
