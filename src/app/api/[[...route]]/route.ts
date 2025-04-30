import { Hono } from "hono";
import { handle } from "hono/vercel";

import accounts from "@/app/api/[[...route]]/accounts";
import categories from "@/app/api/[[...route]]/categories";
import plaid from "@/app/api/[[...route]]/plaid";
import settings from "@/app/api/[[...route]]/settings";
import summary from "@/app/api/[[...route]]/summary";
import transactions from "@/app/api/[[...route]]/transactions";

// Explicitly sets the deployment execution environment to the standard Node.js runtime
export const runtime = "nodejs";

/**
 * Main application entry point utilizing Hono framework.
 */
const app = new Hono().basePath("/api");

// Attaches localized domain logic handlers under corresponding routing prefixes
const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/plaid", plaid)
  .route("/settings", settings)
  .route("/summary", summary)
  .route("/transactions", transactions);

// Adapts and exports the composed routing matrix into standard HTTP verbs
export const GET = handle(routes);
export const POST = handle(routes);
export const PATCH = handle(routes);
export const DELETE = handle(routes);

/**
 * Exported type signature representing the complete application API specifications.
 */
export type AppType = typeof routes;
