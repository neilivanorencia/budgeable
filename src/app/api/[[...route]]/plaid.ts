import { Hono } from "hono";
import { Configuration, CountryCode, PlaidApi, PlaidEnvironments, Products } from "plaid";
import { z } from "zod";

import { db } from "@/db";
import { accounts, categories, connectedBanks } from "@/db/schema";
import { syncAccounts, syncCategories, syncTransactions } from "@/lib/plaid-sync";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, isNotNull } from "drizzle-orm";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET_KEY,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

const app = new Hono()
  .get("/connected-bank", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [connectedBank] = await db
      .select()
      .from(connectedBanks)
      .where(eq(connectedBanks.userId, auth.userId));

    return c.json({ data: connectedBank || null }, 200);
  })
  .delete("/connected-bank", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [connectedBank] = await db
      .delete(connectedBanks)
      .where(eq(connectedBanks.userId, auth.userId))
      .returning({
        id: connectedBanks.id,
      });

    if (!connectedBank) {
      return c.json({ error: "Connected bank not found" }, 404);
    }

    await db
      .delete(accounts)
      .where(and(eq(accounts.userId, auth.userId), isNotNull(accounts.plaidId)));

    await db
      .delete(categories)
      .where(and(eq(categories.userId, auth.userId), isNotNull(categories.plaidId)));

    return c.json({ data: connectedBank || null }, 200);
  })
  .post("/create-link-token", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const token = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: auth.userId,
      },
      client_name: "Budgeable",
      products: [Products.Transactions],
      country_codes: [
        CountryCode.Us, // United States
        CountryCode.Gb, // United Kingdom
        CountryCode.Es, // Spain
        CountryCode.Nl, // Netherlands
        CountryCode.Fr, // France
        CountryCode.Ie, // Ireland
        CountryCode.Ca, // Canada
        CountryCode.De, // Germany
        CountryCode.It, // Italy
        CountryCode.Pl, // Poland
        CountryCode.Dk, // Denmark
        CountryCode.No, // Norway
        CountryCode.Se, // Sweden
        CountryCode.Ee, // Estonia
        CountryCode.Lt, // Lithuania
        CountryCode.Lv, // Latvia
        CountryCode.Pt, // Portugal
        CountryCode.Be, // Belgium
        CountryCode.At, // Austria
        CountryCode.Fi, // Finland
      ],
      language: "en",
    });

    return c.json({ data: token.data.link_token }, 200);
  })
  .post(
    "/exchange-public-token",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        publicToken: z.string(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { publicToken } = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const exchange = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });

      const [connectedBank] = await db
        .insert(connectedBanks)
        .values({
          id: createId(),
          userId: auth.userId,
          accessToken: exchange.data.access_token,
        })
        .returning();

      const plaidTransactions = await plaidClient.transactionsSync({
        access_token: connectedBank.accessToken,
      });

      const plaidAccounts = await plaidClient.accountsGet({
        access_token: connectedBank.accessToken,
      });

      const plaidCategories = await plaidClient.categoriesGet({});

      const newAccounts = await syncAccounts(auth.userId, plaidAccounts.data.accounts);

      const newCategories = await syncCategories(auth.userId, plaidCategories.data.categories);

      await syncTransactions(newAccounts, newCategories, plaidTransactions.data.added);

      return c.json({ ok: true }, 200);
    }
  );

export default app;
