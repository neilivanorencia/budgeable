import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";

import { db } from "@/db/index";
import { accounts, accountsInsertSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";

import { bulkDeleteSchema, idParamSchema } from "@/lib/api-utils";

/**
 * Hono API sub-routing application managing bank or financial accounts.
 */
const app = new Hono()
  .get("/", clerkMiddleware(), async (c) => {
    // Extracts authentication context from Clerk to verify user sessions
    const auth = getAuth(c);

    // Enforces user authorization before executing database queries
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Fetches all account fields belonging exclusively to the authenticated user
    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
        type: accounts.type,
        status: accounts.status,
        description: accounts.description,
        notes: accounts.notes,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    return c.json({ data });
  })
  .get("/:id", zValidator("param", idParamSchema), clerkMiddleware(), async (c) => {
    // Extracts authentication context and validated routing parameters
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    // Validates the presence of the account identification parameter
    if (!id) {
      return c.json({ error: "Missing id" }, 400);
    }

    // Enforces user authorization before accessing sensitive financial account records
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Queries a specific account matching both the account identification and ownership constraints
    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
        type: accounts.type,
        status: accounts.status,
        description: accounts.description,
        notes: accounts.notes,
      })
      .from(accounts)
      .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));

    // Returns a client error response if the matching account data does not exist
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
      accountsInsertSchema.pick({
        name: true,
        type: true,
        status: true,
        description: true,
        notes: true,
      })
    ),
    async (c) => {
      // Extracts authentication context and validated request payload data
      const auth = getAuth(c);
      const values = c.req.valid("json");

      // Restricts account creation capabilities to logged-in sessions only
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Inserts a newly generated account resource tied to the verified user session identifier
      const [data] = await db
        .insert(accounts)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post("/bulk-delete", clerkMiddleware(), zValidator("json", bulkDeleteSchema), async (c) => {
    // Extracts authentication context and validated identifier collections
    const auth = getAuth(c);
    const values = c.req.valid("json");

    // Guards destructive operations behind authentication logic
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Performs transactional deletion of multiple database records owned by the actor
    const data = await db
      .delete(accounts)
      .where(and(eq(accounts.userId, auth.userId), inArray(accounts.id, values.ids)))
      .returning({
        id: accounts.id,
      });

    return c.json({ data });
  })
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", idParamSchema),
    zValidator(
      "json",
      accountsInsertSchema.pick({
        name: true,
        type: true,
        status: true,
        description: true,
        notes: true,
      })
    ),
    async (c) => {
      // Extracts context, path parameters, and fields intended for data modification
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      // Verifies route target definition presence before execution
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      // Prevents anonymous access to data alteration procedures
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Executes updates strictly scoped to the targeted identifier matching the active user session
      const [data] = await db
        .update(accounts)
        .set(values)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning();

      // Signals missing resource error states appropriately back to client sessions
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .delete("/:id", clerkMiddleware(), zValidator("param", idParamSchema), async (c) => {
    // Extracts context and specific identifying parameter for item removal
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    // Asserts that a target identifier is clearly available
    if (!id) {
      return c.json({ error: "Missing id" }, 400);
    }

    // Guards data purging endpoint against anonymous operations
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Drops target item definition conditionally matching resource location and user identifier ownership
    const [data] = await db
      .delete(accounts)
      .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
      .returning({
        id: accounts.id,
      });

    // Validates if execution affected data and returns error context if missing
    if (!data) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data });
  });

export default app;
