import { Pool, type QueryResultRow } from "pg";

// Reuse a single pool across hot reloads in development and across
// invocations in serverless environments (module scope is cached).
declare global {
  var __contactManagerPool: Pool | undefined;
  var __contactManagerSchemaReady: Promise<void> | undefined;
}

function getConnectionString(): string {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "Missing database connection string. Set POSTGRES_URL (or DATABASE_URL) in your environment."
    );
  }
  return connectionString;
}

function createPool(): Pool {
  const connectionString = getConnectionString();

  // Local Postgres (e.g. localhost) generally doesn't use SSL. Most hosted
  // Hosted Postgres providers (Railway, Neon, Supabase, RDS, etc.) require it.
  const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
  const explicitNoSsl = /sslmode=disable/.test(connectionString);

  return new Pool({
    connectionString,
    ssl: isLocal || explicitNoSsl ? undefined : { rejectUnauthorized: false },
    max: 5,
  });
}

function getPool(): Pool {
  if (!global.__contactManagerPool) {
    global.__contactManagerPool = createPool();
  }
  return global.__contactManagerPool;
}

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

const CREATE_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts (created_at DESC);
`;

async function ensureSchema(): Promise<void> {
  const pool = getPool();
  // pgcrypto provides gen_random_uuid(); available on all major hosted
  // Postgres providers. Fall back gracefully if it's already enabled.
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  } catch {
    // Some managed providers restrict CREATE EXTENSION for non-superusers
    // when it's already enabled at the database level - safe to ignore.
  }
  await pool.query(CREATE_TABLE_SQL);
  await pool.query(CREATE_INDEX_SQL);
}

function getSchemaReady(): Promise<void> {
  if (!global.__contactManagerSchemaReady) {
    global.__contactManagerSchemaReady = ensureSchema();
  }
  return global.__contactManagerSchemaReady;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  await getSchemaReady();
  const pool = getPool();
  return pool.query<T>(text, params);
}
