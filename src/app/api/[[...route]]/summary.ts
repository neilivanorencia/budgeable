import { differenceInDays, parse, subDays } from "date-fns";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/db";
import { accounts, categories, transactions } from "@/db/schema";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";

/**
 * Hono API sub-routing application handling dashboard data aggregations.
 */
const app = new Hono().get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })
  ),
  async (c) => {
    // Extracts authentication context and validated search constraints from client properties
    const auth = getAuth(c);
    const { from, to, accountId } = c.req.valid("query");

    // Restricts query calculations to authorized active sessions
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Establishes fallback calendar intervals when parameters are omitted
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    // Transforms input strings into query-ready date instances
    const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    // Dynamically computes preceding chronological block bounds for variance calculations
    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    /**
     * Sub-routine helper evaluating unified ledger entries within a designated timeline.
     */
    async function fetchFinancialData(userId: string, startDate: Date, endDate: Date) {
      return await db
        .select({
          income:
            sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          expense:
            sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ),
          remaining: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        );
    }

    // Pulls metrics for both comparative tracking intervals simultaneously
    const [[currentPeriod], [lastPeriod]] = await Promise.all([
      fetchFinancialData(auth.userId, startDate, endDate),
      fetchFinancialData(auth.userId, lastPeriodStart, lastPeriodEnd),
    ]);

    // Determines contextual rate metrics indicating financial direction vectors
    const incomeChange = calculatePercentageChange(currentPeriod.income, lastPeriod.income);
    const expensesChange = calculatePercentageChange(currentPeriod.expense, lastPeriod.expense);
    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining
    );

    // Compiles categorized cost values sorted from highest impact down to lowest
    const category = await db
      .select({
        name: categories.name,
        color: categories.color,
        value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          lt(transactions.amount, 0),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(categories.name, categories.color)
      .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`));

    // Groups trailing low-impact categories to maintain concise presentation schemas
    const topCategories = category.slice(0, 3);
    const otherCategories = category.slice(3);
    const otherSum = otherCategories.reduce((sum, current) => sum + current.value, 0);

    const finalCategories = topCategories;
    if (otherCategories.length > 0) {
      finalCategories.push({
        name: "Other",
        value: otherSum,
        color: null,
      });
    }

    // Gathers explicit ledger alterations grouped directly by individual date components
    const activeDays = await db
      .select({
        date: transactions.date,
        income:
          sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
            Number
          ),
        expenses:
          sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
            Number
          ),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .groupBy(transactions.date)
      .orderBy(transactions.date);

    // Fills missing calendar matrix slots with empty structural objects to prevent runtime chart graphing breaks
    const days = fillMissingDays(activeDays, startDate, endDate);

    return c.json({
      data: {
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        incomeAmount: currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expense,
        expensesChange,
        categories: finalCategories,
        days,
      },
    });
  }
);

export default app;
