import { eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/db/index";
import { accounts, transactions, userSettings } from "@/db/schema";
import { DEFAULT_CURRENCY } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";

/**
 * Fallback-enabled network utility that fetches standard currency conversion multipliers.
 * @param from - The original three-letter currency code to convert from.
 * @param to - The target three-letter currency code to convert to.
 * @returns A promise that resolves to the exchange rate multiplier.
 */
async function fetchRate(from: string, to: string): Promise<number> {
  const fromL = from.toLowerCase();
  const toL = to.toLowerCase();

  // Defines independent mirror endpoints to ensure resilience against localized CDN downtime
  const urls = [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromL}.json`,
    `https://latest.currency-api.pages.dev/v1/currencies/${fromL}.json`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;

      const json = (await response.json()) as Record<string, Record<string, number>>;
      const rate = json?.[fromL]?.[toL];

      if (typeof rate === "number" && rate > 0) return rate;
    } catch {}
  }

  throw new Error(`Unable to fetch exchange rate for ${from} -> ${to}`);
}

/**
 * Hono API sub-routing application managing global user localization preferences.
 */
const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    // Extracts authentication context from Clerk to verify user sessions
    const auth = getAuth(c);

    // Enforces user authorization before looking up preferences
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Fetches existing preference configurations for the logged-in user context
    const [existing] = await db
      .select({ currency: userSettings.currency })
      .from(userSettings)
      .where(eq(userSettings.userId, auth.userId));

    if (existing) {
      return c.json({ data: existing });
    }

    // Initializes fallback defaults inside data records if a configuration layout is absent
    await db
      .insert(userSettings)
      .values({ userId: auth.userId, currency: DEFAULT_CURRENCY })
      .onConflictDoNothing();

    return c.json({ data: { currency: DEFAULT_CURRENCY } });
  })
  .patch(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        currency: z
          .string()
          .trim()
          .regex(/^[A-Za-z]{3}$/, "Invalid currency code")
          .transform((value) => value.toUpperCase()),
      })
    ),
    async (c) => {
      // Extracts context and validated payload specifications for updating settings
      const auth = getAuth(c);
      const { currency } = c.req.valid("json");

      // Guards preference mutation sequence behind session validation logic
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Looks up current preferences to establish context for conversion calculations
      const [existing] = await db
        .select({ currency: userSettings.currency })
        .from(userSettings)
        .where(eq(userSettings.userId, auth.userId));

      const oldCurrency = existing?.currency ?? DEFAULT_CURRENCY;

      // Simplifies pipeline pathways by avoiding database queries when target currencies match
      if (oldCurrency === currency) {
        await db
          .insert(userSettings)
          .values({ userId: auth.userId, currency })
          .onConflictDoUpdate({ target: userSettings.userId, set: { currency } });

        return c.json({ data: { currency } });
      }

      // Pre-compiles database upsert operation to commit configuration properties cleanly
      const upsertSettings = db
        .insert(userSettings)
        .values({ userId: auth.userId, currency })
        .onConflictDoUpdate({ target: userSettings.userId, set: { currency } });

      // Checks for historical records requiring math transformation routines
      const [hasTransaction] = await db
        .select({ id: transactions.id })
        .from(transactions)
        .innerJoin(accounts, eq(accounts.id, transactions.accountId))
        .where(eq(accounts.userId, auth.userId))
        .limit(1);

      // Skips calculations entirely if the account ledger has no active ledger items
      if (!hasTransaction) {
        await upsertSettings;
        return c.json({ data: { currency } });
      }

      let rate: number;
      try {
        rate = await fetchRate(oldCurrency, currency);
      } catch {
        return c.json({ error: "Could not fetch exchange rate. Currency was not changed." }, 502);
      }

      // Constructs a Common Table Expression to efficiently query matching transaction identifiers
      const userTransactions = db
        .$with("user_transactions")
        .as(
          db
            .select({ id: transactions.id })
            .from(transactions)
            .innerJoin(accounts, eq(accounts.id, transactions.accountId))
            .where(eq(accounts.userId, auth.userId))
        );

      // Pre-compiles bulk mathematics conversion execution using clean rounding logic
      const convertAmounts = db
        .with(userTransactions)
        .update(transactions)
        .set({
          amount: sql`cast(round(${transactions.amount} * cast(${rate} as numeric)) as integer)`,
        })
        .where(inArray(transactions.id, sql`(select id from ${userTransactions})`));

      // Batch processes both expressions in a single network round-trip to guarantee execution alignment
      await db.batch([convertAmounts, upsertSettings]);

      return c.json({ data: { currency } });
    }
  );

export default app;
