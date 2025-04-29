import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

import { neon } from "@neondatabase/serverless";

// Loads environmental variables explicitly from the `.env` file into `process.env`.
config({ path: ".env" });

// Initializes the Neon serverless SQL client using the configured `DATABASE_URL`.
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

/**
 * Executes the database migration process asynchronously.
 */
const main = async () => {
  try {
    // Synchronizes the database schema with the current local migration files.
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migration completed");
  } catch (error) {
    // Catches and logs any structural or connection errors encountered during the migration sequence.
    console.error("Error during migration:", error);
  }
};

// Invokes the migration engine.
main();
