import type { AccountBase, Category, Transaction } from "plaid";

import { db } from "@/db";
import { accounts, categories, transactions } from "@/db/schema";
import { convertAmountToMiliunits } from "@/lib/utils";
import { createId } from "@paralleldrive/cuid2";

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

export async function syncTransactions(
  newAccounts: NewAccount[],
  newCategories: NewCategory[],
  added: Transaction[]
) {
  const newTransactionsValues = added.reduce(
    (acc, transaction) => {
      const account = newAccounts.find((account) => account.plaidId === transaction.account_id);
      const category = newCategories.find(
        (category) => category.plaidId === transaction.category_id
      );
      const amountInMiliunits = convertAmountToMiliunits(transaction.amount);

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

  if (newTransactionsValues.length > 0) {
    await db.insert(transactions).values(newTransactionsValues);
  }
}
