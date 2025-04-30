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

// Initializes the Plaid API configuration specifying sandbox environment credentials
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

/**
 * Hono API sub-routing application handling Plaid Integration lifecycle workflows.
 */
const app = new Hono()
  .get("/connected-bank", clerkMiddleware(), async (c) => {
    // Extracts authentication context from Clerk to verify user sessions
    const auth = getAuth(c);

    // Enforces user authorization before looking up connected items
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Fetches linked banking records for the authenticated user session
    const [connectedBank] = await db
      .select()
      .from(connectedBanks)
      .where(eq(connectedBanks.userId, auth.userId));

    return c.json({ data: connectedBank || null }, 200);
  })
  .delete("/connected-bank", clerkMiddleware(), async (c) => {
    // Extracts authentication context from Clerk to verify user sessions
    const auth = getAuth(c);

    // Enforces user authorization before managing account alterations
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Disconnects the primary bank link token definition record
    const [connectedBank] = await db
      .delete(connectedBanks)
      .where(eq(connectedBanks.userId, auth.userId))
      .returning({
        id: connectedBanks.id,
      });

    // Halts deletion sequence if no bank link exists for the user session
    if (!connectedBank) {
      return c.json({ error: "Connected bank not found" }, 404);
    }

    // Cascades deletion downstream to clear all fetched automated Plaid accounts
    await db
      .delete(accounts)
      .where(and(eq(accounts.userId, auth.userId), isNotNull(accounts.plaidId)));

    // Cascades deletion downstream to clear all mapped Plaid category definitions
    await db
      .delete(categories)
      .where(and(eq(categories.userId, auth.userId), isNotNull(categories.plaidId)));

    return c.json({ data: connectedBank || null }, 200);
  })
  .post("/create-link-token", clerkMiddleware(), async (c) => {
    // Extracts authentication context from Clerk to verify user sessions
    const auth = getAuth(c);

    // Enforces user authorization before dispatching token requests to Plaid endpoints
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Requests a link token from Plaid configured for international coverage and transaction tracking
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
      // Extracts context and public token definition from payload values
      const auth = getAuth(c);
      const { publicToken } = c.req.valid("json");

      // Enforces authorization guard logic for the exchange procedure
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Exchanges short-lived client-side public token for a permanent access token via Plaid API
      const exchange = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });

      // Saves the private access token reference assigned under the current authenticated identity
      const [connectedBank] = await db
        .insert(connectedBanks)
        .values({
          id: createId(),
          userId: auth.userId,
          accessToken: exchange.data.access_token,
        })
        .returning();

      // Retrieves transaction history mutations using Plaid synchronizations
      const plaidTransactions = await plaidClient.transactionsSync({
        access_token: connectedBank.accessToken,
      });

      // Fetches account balances and system global category catalogs in parallel
      const [plaidAccounts, plaidCategories] = await Promise.all([
        plaidClient.accountsGet({ access_token: connectedBank.accessToken }),
        plaidClient.categoriesGet({}),
      ]);

      // Populates system internal databases with new tracking properties mapped from upstream objects
      const [newAccounts, newCategories] = await Promise.all([
        syncAccounts(auth.userId, plaidAccounts.data.accounts),
        syncCategories(auth.userId, plaidCategories.data.categories),
      ]);

      // Commits initial records tracking individual item ledger adjustments discovered during synchronization
      await syncTransactions(newAccounts, newCategories, plaidTransactions.data.added);

      return c.json({ ok: true }, 200);
    }
  );

export default app;
