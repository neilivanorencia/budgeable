import { Hono } from "hono";
import { handle } from "hono/vercel";

import accounts from "@/app/api/[[...route]]/accounts";
import categories from "@/app/api/[[...route]]/categories";
import plaid from "@/app/api/[[...route]]/plaid";
import settings from "@/app/api/[[...route]]/settings";
import summary from "@/app/api/[[...route]]/summary";
import transactions from "@/app/api/[[...route]]/transactions";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/plaid", plaid)
  .route("/settings", settings)
  .route("/summary", summary)
  .route("/transactions", transactions);

export const GET = handle(routes);
export const POST = handle(routes);
export const PATCH = handle(routes);
export const DELETE = handle(routes);

export type AppType = typeof routes;
