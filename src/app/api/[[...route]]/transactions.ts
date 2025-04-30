import { parse } from "date-fns";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/db/index";
import { accounts, categories, transactions, transactionsInsertSchema } from "@/db/schema";
import { bulkDeleteSchema, idParamSchema } from "@/lib/api-utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

/**
 * Hono API sub-routing application managing granular ledger items and transaction logs.
 */
const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      // Extracts authentication context and validated search parameters from the request
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      // Converts string-represented query conditions into operational calendar dates
      const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : undefined;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : undefined;

      // Resolves ledger lines joined against associated metadata frameworks
      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(accounts.id, transactions.accountId))
        .leftJoin(categories, eq(categories.id, transactions.categoryId))
        .where(
          and(
            ...[
              accountId ? eq(transactions.accountId, accountId) : undefined,
              auth?.userId ? eq(accounts.userId, auth.userId) : undefined,
              startDate ? gte(transactions.date, startDate) : undefined,
              endDate ? lte(transactions.date, endDate) : undefined,
            ].filter(Boolean)
          )
        )
        .orderBy(desc(transactions.date));

      return c.json({ data });
    }
  )
  .get("/:id", zValidator("param", idParamSchema), clerkMiddleware(), async (c) => {
    // Extracts context parameters and specific asset identification values
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    // Guards core process from routing anomalies missing a target identifier
    if (!id) {
      return c.json({ error: "Missing id" }, 400);
    }

    // Prohibits unauthenticated sessions from viewing single entity tracking details
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Selects specific structural dimensions filtered strictly by account profile ownership bounds
    const data = await db
      .select({
        id: transactions.id,
        date: transactions.date,
        categoryId: transactions.categoryId,
        payee: transactions.payee,
        amount: transactions.amount,
        notes: transactions.notes,
        accountId: transactions.accountId,
      })
      .from(transactions)
      .innerJoin(accounts, eq(accounts.id, transactions.accountId))
      .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)));

    // Halts resolution when requested identifiers point to vacant index entries
    if (!data) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data: data[0] });
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      transactionsInsertSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      // Extracts context parameters and validated creation parameters
      const auth = getAuth(c);
      const values = c.req.valid("json");

      // Validates presence of verified profile credentials before committing additions
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Appends random sequence keys to clean payloads and logs new instances inside the table array
      const [data] = await db
        .insert(transactions)
        .values({
          id: createId(),
          ...values,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        transactionsInsertSchema
          .omit({
            id: true,
          })
          .extend({
            categoryId: z.string().optional(),
          })
      )
    ),
    async (c) => {
      // Extracts security context parameters alongside the array of proposed modifications
      const auth = getAuth(c);
      const values = c.req.valid("json");

      // Blocks batch ingestion attempts sourced from unverified web client targets
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Queries primary default classification parameters to auto-populate unmapped line imports
      const defaultCategory = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.userId, auth.userId))
        .limit(1);

      const defaultCategoryId = defaultCategory.length > 0 ? defaultCategory[0].id : null;

      // Restricts data importing actions if no standard fallback categorization catalog exists yet
      if (!defaultCategoryId) {
        return c.json(
          {
            success: false,
            error:
              "No categories found. Create at least one category before importing transactions.",
          },
          400
        );
      }

      // Transforms the payload collection by injecting transaction unique keys and category fallbacks
      const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            id: createId(),
            ...value,
            categoryId: value.categoryId || defaultCategoryId,
          }))
        )
        .returning();

      return c.json({ data });
    }
  )
  .post("/bulk-delete", clerkMiddleware(), zValidator("json", bulkDeleteSchema), async (c) => {
    // Extracts security context parameters alongside structural identifier targets
    const auth = getAuth(c);
    const values = c.req.valid("json");

    // Enforces standard session presence rules ahead of clearing database files
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Evaluates explicit targets securely by wrapping parameters in a Common Table Expression
    const transactionToDelete = db.$with("transactions_to_delete").as(
      db
        .select({
          id: transactions.id,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(inArray(transactions.id, values.ids), eq(accounts.userId, auth.userId)))
    );

    // Drops dataset elements located inside the evaluated context boundaries
    const data = await db
      .with(transactionToDelete)
      .delete(transactions)
      .where(inArray(transactions.id, sql`(select id from ${transactionToDelete})`))
      .returning({
        id: transactions.id,
      });

    return c.json({ data });
  })
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", idParamSchema),
    zValidator(
      "json",
      transactionsInsertSchema.omit({
        id: true,
      })
    ),
    async (c) => {
      // Extracts context, targets, and specific properties chosen for updating operations
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      // Prevents execution execution sequences if parameters lack definition
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      // Blocks anonymous execution paths prior to running table alterations
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Isolates target modification sets via expression joins to ensure strict identity filtering
      const transactionToUpdate = db.$with("transactions_to_update").as(
        db
          .select({
            id: transactions.id,
          })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
      );

      // Merges altered values inside records that map directly onto the targeted dataset slice
      const [data] = await db
        .with(transactionToUpdate)
        .update(transactions)
        .set(values)
        .where(inArray(transactions.id, sql`(select id from ${transactionToUpdate})`))
        .returning();

      // Transmits error signaling logs if target items escape tracking updates
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .delete("/:id", clerkMiddleware(), zValidator("param", idParamSchema), async (c) => {
    // Extracts transaction information properties from the routing target parameters
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    // Directs execution away from execution loops lacking an explicit key mapping
    if (!id) {
      return c.json({ error: "Missing id" }, 400);
    }

    // Rejects operation executions when profiles lack signed identity tokens
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Confirms record ownership contexts using a Common Table Expression before completing updates
    const transactionToDelete = db.$with("transactions_to_delete").as(
      db
        .select({
          id: transactions.id,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
    );

    // Purges targeted rows corresponding to computed identification states
    const [data] = await db
      .with(transactionToDelete)
      .delete(transactions)
      .where(inArray(transactions.id, sql`(select id from ${transactionToDelete})`))
      .returning({
        id: transactions.id,
      });

    // Dispatches alert contexts to client environments if the target key references empty coordinates
    if (!data) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data });
  });

export default app;
