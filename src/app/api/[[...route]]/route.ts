import { Hono } from "hono";
import { handle } from "hono/vercel";

import accounts from "@/app/api/[[...route]]/accounts";
import categories from "@/app/api/[[...route]]/categories";
import plaid from "@/app/api/[[...route]]/plaid";
import summary from "@/app/api/[[...route]]/summary";
import transactions from "@/app/api/[[...route]]/transactions";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/plaid", plaid)
  .route("/summary", summary)
  .route("/transactions", transactions);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
