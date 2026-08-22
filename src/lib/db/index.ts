import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

const LOCAL_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "host.docker.internal",
]);

function createClient(): postgres.Sql {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env for local development or configure it in your hosting provider's environment variables.",
    );
  }

  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    throw new Error(
      'DATABASE_URL is not a valid PostgreSQL connection string. Expected format: postgresql://user:password@host:5432/db',
    );
  }

  const sslMode = url.searchParams.get("sslmode")?.toLowerCase();
  let ssl: boolean;
  if (sslMode === "disable" || sslMode === "false") {
    ssl = false;
  } else if (
    sslMode === "require" ||
    sslMode === "verify-ca" ||
    sslMode === "verify-full" ||
    sslMode === "true"
  ) {
    ssl = true;
  } else {
    ssl = !LOCAL_HOSTS.has(url.hostname);
  }

  return postgres(connectionString, {
    prepare: false,
    ssl,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    onnotice: () => {},
  });
}

const globalStore = globalThis as unknown as {
  __globetrotterDb?: Database;
};

function getDb(): Database {
  globalStore.__globetrotterDb ??= drizzle(createClient(), { schema });
  return globalStore.__globetrotterDb;
}

export const db: Database = new Proxy({} as Database, {
  get(_target, prop) {
    const instance = getDb() as unknown as Record<string | symbol, unknown>;
    const value = instance[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { schema };
