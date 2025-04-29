import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Defines the supported financial account types within the system.
 */
export const ACCOUNT_TYPES = [
  "cash",
  "checking",
  "savings",
  "credit",
  "investment",
  "ewallet",
  "other",
] as const;

/**
 * Type inferred from the supported financial account types.
 */
export type AccountType = (typeof ACCOUNT_TYPES)[number];

/**
 * Defines the operational statuses available for an account.
 */
export const ACCOUNT_STATUSES = ["active", "archived"] as const;

/**
 * Type inferred from the available account operational statuses.
 */
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

/**
 * Defines the core classification types for a budget category.
 */
export const CATEGORY_TYPES = ["income", "expense"] as const;

/**
 * Type inferred from the available budget category types.
 */
export type CategoryType = (typeof CATEGORY_TYPES)[number];

/**
 * Represents the schema configuration for the `accounts` database table.
 * Stores information about user financial accounts, supporting Plaid integrations.
 */
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  type: text("type").notNull().default("other"),
  status: text("status").notNull().default("active"),
  description: text("description"),
  notes: text("notes"),
});

/**
 * Defines database relationships for the `accounts` table.
 * Establishes a one-to-many relationship with the `transactions` table.
 */
export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

/**
 * Zod validation schema for inserting records into the `accounts` table.
 * Overrides the base text type validations with strict enum constraints.
 */
export const accountsInsertSchema = createInsertSchema(accounts, {
  type: z.enum(ACCOUNT_TYPES).optional(),
  status: z.enum(ACCOUNT_STATUSES).optional(),
});

/**
 * Represents the schema configuration for the `categories` database table.
 * Enables users to categorize and track their transactions.
 */
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  type: text("type").notNull().default("expense"),
  color: text("color"),
  description: text("description"),
  notes: text("notes"),
});

/**
 * Defines database relationships for the `categories` table.
 * Establishes a one-to-many relationship with the `transactions` table.
 */
export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

/**
 * Zod validation schema for inserting records into the `categories` table.
 * Restricts the `type` field to allowed category classifications.
 */
export const categoriesInsertSchema = createInsertSchema(categories, {
  type: z.enum(CATEGORY_TYPES).optional(),
});

/**
 * Represents the schema configuration for the `transactions` database table.
 * Records financial entries linked directly to an account and a category.
 */
export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id")
    .references(() => accounts.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: text("category_id")
    .references(() => categories.id, {
      onDelete: "set null",
    })
    .notNull(),
});

/**
 * Defines database relationships for the `transactions` table.
 * Establishes many-to-one constraints back to the `accounts` and `categories` tables.
 */
export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

/**
 * Zod validation schema for inserting records into the `transactions` table.
 * Coerces the incoming raw values into standard JavaScript `Date` objects.
 */
export const transactionsInsertSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});

/**
 * Represents the schema configuration for the `connected_banks` database table.
 * Stores access tokens required to communicate securely with external banking institutions.
 */
export const connectedBanks = pgTable("connected_banks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  accessToken: text("access_token").notNull(),
});

/**
 * Represents the schema configuration for the `user_settings` database table.
 * Persists application-wide preferences customizable by individual users.
 */
export const userSettings = pgTable("user_settings", {
  userId: text("user_id").primaryKey(),
  currency: text("currency").notNull().default("USD"),
});

/**
 * Zod validation schema for inserting records into the `user_settings` table.
 */
export const userSettingsInsertSchema = createInsertSchema(userSettings);
