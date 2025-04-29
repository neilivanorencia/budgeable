import { drizzle } from "drizzle-orm/neon-http";

import { neon } from "@neondatabase/serverless";

// Initializes the Neon serverless SQL client using the `DATABASE_URL` environment variable.
const sql = neon(process.env.DATABASE_URL!);

/**
 * The primary database client instance configured with Drizzle ORM.
 */
export const db = drizzle({ client: sql });
