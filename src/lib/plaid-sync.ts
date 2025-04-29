import type { AccountBase, Category, Transaction } from "plaid";

import { db } from "@/db";
import { accounts, categories, transactions } from "@/db/schema";
import { convertAmountToMiliunits } from "@/lib/utils";
import { createId } from "@paralleldrive/cuid2";

/**
 * Commits a list of active institution accounts fetched via Plaid into the local database tracking registry.
 */
export async function syncAccounts(userId: string, plaidAccounts: AccountBase[]) {
  return db
    .insert(accounts)
    .values(
      plaidAccounts.map((account) => ({
        id: createId(),
        name: account.name,
        plaidId: account.account_id,
        userId,
      }))
    )
    .returning();
}

/**
 * Maps and inserts hierarchical classification categories populated by Plaid directly into the user context parameters.
 */
export async function syncCategories(userId: string, plaidCategories: Category[]) {
  return db
    .insert(categories)
    .values(
      plaidCategories.map((category) => ({
        id: createId(),
        name: category.hierarchy.join(", "),
        plaidId: category.category_id,
        userId,
      }))
    )
    .returning();
}

type NewAccount = Awaited<ReturnType<typeof syncAccounts>>[number];
type NewCategory = Awaited<ReturnType<typeof syncCategories>>[number];

/**
 * Intercepts incoming ledger event structures from a Plaid webhook synchronization delta
 */
export async function syncTransactions(
  newAccounts: NewAccount[],
  newCategories: NewCategory[],
  added: Transaction[]
) {
  // Processes raw historical entry arrays into uniform insert schema record arrays
  const newTransactionsValues = added.reduce(
    (acc, transaction) => {
      // Resolves structural database keys matching the incoming transaction payload indicators
      const account = newAccounts.find((account) => account.plaidId === transaction.account_id);
      const category = newCategories.find(
        (category) => category.plaidId === transaction.category_id
      );

      // Converts floating point values to safe, integer-based milliunits to bypass arithmetic precision loss
      const amountInMiliunits = convertAmountToMiliunits(transaction.amount);

      // Ensures the parent account mapping boundary has been successfully synced before appending ledger rows
      if (account) {
        acc.push({
          id: createId(),
          amount: amountInMiliunits,
          payee: transaction.merchant_name || transaction.name,
          notes: transaction.name,
          date: new Date(transaction.date),
          accountId: account.id,
          categoryId: category?.id || "Uncategorized",
        });
      }

      return acc;
    },
    [] as (typeof transactions.$inferInsert)[]
  );

  // Executes a massive optimized multi-row transactional insert statement pool if data entries exist
  if (newTransactionsValues.length > 0) {
    await db.insert(transactions).values(newTransactionsValues);
  }
}
