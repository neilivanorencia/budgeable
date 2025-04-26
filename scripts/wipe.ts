import * as p from "@clack/prompts";
import { createClerkClient } from "@clerk/backend";
import { eq, inArray } from "drizzle-orm";

import { accounts, categories, createDb, dbHost, loadEnv, transactions } from "@/lib/seed";

function bail<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel("Cancelled. Nothing was deleted.");
    process.exit(0);
  }
  return value as T;
}

async function main() {
  const { databaseUrl, clerkSecretKey } = loadEnv();
  const db = createDb(databaseUrl);
  const clerk = createClerkClient({ secretKey: clerkSecretKey });

  p.intro("Budgeable Wipe");

  const userId = bail(
    await p.text({
      message: "Clerk userId to wipe?",
      placeholder: "Enter Clerk userId...",
      validate: (v) => (v.trim().length === 0 ? "userId cannot be empty." : undefined),
    })
  ).trim();

  const accountRows = await db
    .select({ id: accounts.id })
    .from(accounts)
    .where(eq(accounts.userId, userId));
  const categoryRows = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.userId, userId));

  const accountIds = accountRows.map((r) => r.id);
  let transactionCount = 0;
  if (accountIds.length > 0) {
    const txnRows = await db
      .select({ id: transactions.id })
      .from(transactions)
      .where(inArray(transactions.accountId, accountIds));
    transactionCount = txnRows.length;
  }

  const hasData = accountRows.length + categoryRows.length + transactionCount > 0;
  if (!hasData) {
    p.log.info("This user has no finance data in the database.");
  } else {
    p.note(
      [
        `Accounts:     ${accountRows.length}`,
        `Categories:   ${categoryRows.length}`,
        `Transactions: ${transactionCount}`,
      ].join("\n"),
      `Found for ${userId}`
    );
  }

  const scope = bail(
    await p.select({
      message: "What should be removed?",
      options: [
        { value: "db", label: "Database data only", hint: "Keep the Clerk user" },
        { value: "db+clerk", label: "Database data + delete the Clerk user", hint: "Irreversible" },
      ],
    })
  ) as "db" | "db+clerk";

  if (!hasData && scope === "db") {
    p.outro("Nothing to do.");
    process.exit(0);
  }

  p.note(
    [
      `Target:  ${userId}`,
      `DB host: ${dbHost(databaseUrl)}`,
      `Delete:  Accounts + Categories + Transactions for this user`,
      `Clerk:   ${scope === "db+clerk" ? "DELETE the Clerk user too" : "untouched"}`,
    ].join("\n"),
    "About to delete"
  );

  const confirm = bail(
    await p.text({
      message: "Type 'yes' to permanently delete",
      validate: (v) =>
        v.trim() === "yes" ? undefined : "Type exactly 'yes' to continue, or Ctrl-C to abort.",
    })
  );
  if (confirm.trim() !== "yes") {
    p.cancel("Aborted.");
    process.exit(0);
  }

  const s = p.spinner();
  s.start("Deleting...");
  try {
    if (accountIds.length > 0) {
      await db.delete(transactions).where(inArray(transactions.accountId, accountIds));
    }
    await db.delete(accounts).where(eq(accounts.userId, userId));
    await db.delete(categories).where(eq(categories.userId, userId));

    if (scope === "db+clerk") {
      s.message("Deleting Clerk user...");
      await clerk.users.deleteUser(userId);
    }

    s.stop("Wipe complete.");
    p.outro(
      scope === "db+clerk" ? "Database data and Clerk user removed." : "Database data removed."
    );
  } catch (err) {
    s.stop("Wipe failed.");
    const message = err instanceof Error ? err.message : String(err);
    p.cancel(`Error: ${message}`);
    process.exit(1);
  }
}

main();
