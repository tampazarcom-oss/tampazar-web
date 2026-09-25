import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const isDbConfigured = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tampazar',
  connectionTimeoutMillis: 1500,
});

// Suppress unhandled error events from pool when PostgreSQL is not configured/offline
pool.on('error', () => {
  // Silent fallback: In-memory/mock data layer handles requests seamlessly
});

let cachedConnectionStatus: boolean | null = null;
let lastCheckTime = 0;

export async function checkDatabaseConnection(): Promise<boolean> {
  if (!isDbConfigured) {
    return false;
  }
  const now = Date.now();
  if (cachedConnectionStatus !== null && now - lastCheckTime < 15000) {
    return cachedConnectionStatus;
  }
  try {
    const client = await pool.connect();
    client.release();
    cachedConnectionStatus = true;
    lastCheckTime = now;
    return true;
  } catch {
    cachedConnectionStatus = false;
    lastCheckTime = now;
    return false;
  }
}

export const db = drizzle(pool, { schema });
