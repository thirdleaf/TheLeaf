// ─────────────────────────────────────────────────────────────
// @thirdleaf/db — Neon + Drizzle connection
// Uses @neondatabase/serverless HTTP driver for edge compatibility.
// ─────────────────────────────────────────────────────────────

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create the Neon HTTP client
const sql = neon(databaseUrl);

// Create the Drizzle ORM instance with full schema for relational queries
export const db = drizzle(sql, { schema });

// Re-export schema for convenience
export * from "./schema.js";

// Export the raw sql client for edge cases requiring direct queries
export { sql };
