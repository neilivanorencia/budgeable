import { eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/db/index";
import { accounts, transactions, userSettings } from "@/db/schema";
import { DEFAULT_CURRENCY } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";

async function fetchRate(from: string, to: string): Promise<number> {
  const fromL = from.toLowerCase();
  const toL = to.toLowerCase();

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

const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [existing] = await db
      .select({ currency: userSettings.currency })
      .from(userSettings)
      .where(eq(userSettings.userId, auth.userId));

    if (existing) {
      return c.json({ data: existing });
    }

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
      const auth = getAuth(c);
      const { currency } = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [existing] = await db
        .select({ currency: userSettings.currency })
        .from(userSettings)
        .where(eq(userSettings.userId, auth.userId));

      const oldCurrency = existing?.currency ?? DEFAULT_CURRENCY;

      if (oldCurrency === currency) {
        await db
          .insert(userSettings)
          .values({ userId: auth.userId, currency })
          .onConflictDoUpdate({ target: userSettings.userId, set: { currency } });

        return c.json({ data: { currency } });
      }

      const upsertSettings = db
        .insert(userSettings)
        .values({ userId: auth.userId, currency })
        .onConflictDoUpdate({ target: userSettings.userId, set: { currency } });

      const [hasTransaction] = await db
        .select({ id: transactions.id })
        .from(transactions)
        .innerJoin(accounts, eq(accounts.id, transactions.accountId))
        .where(eq(accounts.userId, auth.userId))
        .limit(1);

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

      const userTransactions = db
        .$with("user_transactions")
        .as(
          db
            .select({ id: transactions.id })
            .from(transactions)
            .innerJoin(accounts, eq(accounts.id, transactions.accountId))
            .where(eq(accounts.userId, auth.userId))
        );

      const convertAmounts = db
        .with(userTransactions)
        .update(transactions)
        .set({
          amount: sql`cast(round(${transactions.amount} * cast(${rate} as numeric)) as integer)`,
        })
        .where(inArray(transactions.id, sql`(select id from ${userTransactions})`));

      await db.batch([convertAmounts, upsertSettings]);

      return c.json({ data: { currency } });
    }
  );

export default app;
