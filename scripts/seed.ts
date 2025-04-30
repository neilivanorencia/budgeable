import * as p from "@clack/prompts";
import { createClerkClient } from "@clerk/backend";
import { createId } from "@paralleldrive/cuid2";
import { faker } from "@faker-js/faker";
import { isValid, parse } from "date-fns";
import { eq, inArray } from "drizzle-orm";

import {
  ACCOUNT_TYPE_DESCRIPTIONS,
  ACCOUNT_TYPE_MAP,
  CATEGORY_CATALOG,
  SEED_CURRENCY,
  type CategoryTemplate,
  accounts,
  categories,
  convertAmountToMiliunits,
  createDb,
  dbHost,
  loadEnv,
  transactions,
  userSettings,
} from "@/lib/seed";

// Hard upper boundaries for seeding generation limits
const CAPS = { accounts: 10, categories: 20, transactions: 5000 } as const;

// Standalone fallback counts when input strings are submitted blank
const DEFAULTS = { accounts: 4, categories: 10, transactions: 500 } as const;

// Common names for account mapping scenarios
const ACCOUNT_NAMES = [
  "Checking Account",
  "Savings Account",
  "Chase Checking",
  "Bank of America Savings",
  "PayPal",
  "Wise Account",
  "Revolut",
  "Credit Card",
  "Visa Debit",
  "Cash Wallet",
];

/**
 * Handles Clack terminal escape combinations by safely forcing a script exit.
 * @param value - The input value or cancellation symbol to evaluate.
 * @returns The original unescaped value if cancellation is not triggered.
 */
function bail<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel("Cancelled. Nothing was written.");
    process.exit(0);
  }
  return value as T;
}

/**
 * Captures user configuration integers via interactive CLI text questions.
 * @param label - The singular description string printed to the terminal screen.
 * @param max - The absolute maximum value accepted by the prompt validation checks.
 * @param def - The standard integer applied when questions receive empty returns.
 * @returns A validated positive number within bounds.
 */
async function promptCount(label: string, max: number, def: number) {
  const raw = bail(
    await p.text({
      message: `How many ${label}? (1-${max})`,
      placeholder: String(def),
      defaultValue: String(def),
      validate(value) {
        const v = value.trim() === "" ? String(def) : value.trim();
        if (!/^\d+$/.test(v)) return "Enter a whole number.";
        const n = Number(v);
        if (n < 1) return "Must be at least 1.";
        if (n > max) return `Maximum is ${max}.`;
        return undefined;
      },
    })
  );
  return Number(raw.trim() === "" ? def : raw.trim());
}

/**
 * Requests and parses standalone text entries into valid Date objects.
 * @param message - The informational text query printed to the terminal console.
 * @returns A validated Javascript Date object.
 */
async function promptDate(message: string) {
  const raw = bail(
    await p.text({
      message,
      placeholder: "2024-01-01",
      validate(value) {
        const v = value.trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Use the format YYYY-MM-DD.";
        const d = parse(v, "yyyy-MM-dd", new Date());
        if (!isValid(d)) return "That is not a real calendar date.";
        return undefined;
      },
    })
  );
  return parse(raw.trim(), "yyyy-MM-dd", new Date());
}

/**
 * Builds strong authentication strings matching common complex validation schemas.
 * @returns A high-entropy password containing casing variations, digits, and a symbol character.
 */
function generatePassword() {
  const upper = faker.string.alpha({ length: 4, casing: "upper" });
  const lower = faker.string.alpha({ length: 4, casing: "lower" });
  const digits = faker.string.numeric(3);
  const symbol = faker.helpers.arrayElement(["!", "@", "#", "$", "%", "&", "*"]);
  return faker.helpers.shuffle((upper + lower + digits + symbol).split("")).join("");
}

/**
 * Counts existing records associated with a given user identifier to evaluate state density.
 * @param db - Configured Drizzle ORM client instance.
 * @param userId - Target profile identity key string.
 * @returns Collection counts along with a list of extracted account identifiers.
 */
async function getUserCounts(db: ReturnType<typeof createDb>, userId: string) {
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

  return {
    accounts: accountRows.length,
    categories: categoryRows.length,
    transactions: transactionCount,
    accountIds,
  };
}

/**
 * Destroys all historical application files assigned to a unique account identity.
 * @param db - Configured Drizzle ORM client instance.
 * @param userId - Target profile identity key string.
 * @param accountIds - Array of active relational identifiers to clear.
 */
async function wipeUser(db: ReturnType<typeof createDb>, userId: string, accountIds: string[]) {
  if (accountIds.length > 0) {
    await db.delete(transactions).where(inArray(transactions.accountId, accountIds));
  }
  await db.delete(accounts).where(eq(accounts.userId, userId));
  await db.delete(categories).where(eq(categories.userId, userId));
  await db.delete(userSettings).where(eq(userSettings.userId, userId));
}

/**
 * Splits massive insert sets into manageable array sizes to bypass connection payload throttles.
 * @param insertRows - Callback execution function committing database assignments.
 * @param rows - The target data array records to process.
 */
async function chunkedInsert<TInsert>(
  insertRows: (chunk: TInsert[]) => Promise<unknown>,
  rows: TInsert[]
) {
  const size = 200;
  for (let i = 0; i < rows.length; i += size) {
    await insertRows(rows.slice(i, i + size));
  }
}

/**
 * Orchestrator routine driving the automated data generation workspace.
 * Creates identities, shapes target metrics, and builds relational financial maps.
 */
async function main() {
  const { databaseUrl, clerkSecretKey } = loadEnv();
  const db = createDb(databaseUrl);
  const clerk = createClerkClient({ secretKey: clerkSecretKey });

  p.intro("Budgeable Seeder");

  // Selects between standing profiling nodes or generating an entirely new account entity
  const mode = bail(
    await p.select({
      message: "Who should this data belong to?",
      options: [
        {
          value: "new",
          label: "Create a new Clerk user",
          hint: "Returns working login credentials",
        },
        { value: "existing", label: "Use an existing Clerk userId" },
      ],
    })
  ) as "new" | "existing";

  let userId: string;
  let createdCredentials: { email: string; password: string } | null = null;

  // Provisions fresh backend nodes via Clerk management integrations if requested
  if (mode === "new") {
    const fullName = bail(
      await p.text({
        message: "Full name?",
        placeholder: "Enter name...",
        validate: (v) => (v.trim().length === 0 ? "Name cannot be empty." : undefined),
      })
    ).trim();

    const email = bail(
      await p.text({
        message: "Email? (This will be used to sign in)",
        placeholder: "Enter email...",
        validate(value) {
          const v = value.trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
          return undefined;
        },
      })
    ).trim();

    const [firstName, ...rest] = fullName.split(/\s+/);
    const lastName = rest.join(" ") || undefined;
    const password = generatePassword();

    const s = p.spinner();
    s.start("Creating Clerk user...");
    try {
      const user = await clerk.users.createUser({
        emailAddress: [email],
        password,
        firstName,
        lastName,
        skipPasswordChecks: true,
      });
      userId = user.id;
      createdCredentials = { email, password };
      s.stop(`Clerk user created: ${userId}`);
    } catch (err) {
      s.stop("Failed to create Clerk user.");
      const message = err instanceof Error ? err.message : String(err);
      p.cancel(`Clerk error: ${message}`);
      process.exit(1);
    }
  } else {
    // Collects standing verification strings directly from manual console submissions
    userId = bail(
      await p.text({
        message: "Existing Clerk userId?",
        placeholder: "Enter Clerk userId...",
        validate: (v) => (v.trim().length === 0 ? "userId cannot be empty." : undefined),
      })
    ).trim();
  }

  // Captures structural balance specifications via individual volume requests
  const accountCount = await promptCount("accounts", CAPS.accounts, DEFAULTS.accounts);
  const requestedCategoryCount = await promptCount(
    "categories",
    CAPS.categories,
    DEFAULTS.categories
  );
  const transactionCount = await promptCount(
    "transactions",
    CAPS.transactions,
    DEFAULTS.transactions
  );

  // Verifies requested items fall inside bounded repository catalog definitions
  const categoryCount = Math.min(requestedCategoryCount, CATEGORY_CATALOG.length);
  if (categoryCount < requestedCategoryCount) {
    p.log.warn(
      `Curated catalog has ${CATEGORY_CATALOG.length} categories; using ${categoryCount} instead of ${requestedCategoryCount}.`
    );
  }

  // Validates time bounding layouts to maintain uniform chronology metrics
  const startDate = await promptDate("Start date for the data span? (YYYY-MM-DD)");
  let endDate = await promptDate("End date for the data span? (YYYY-MM-DD)");
  while (startDate > endDate) {
    p.log.error("Start date is after end date. Please re-enter the end date.");
    endDate = await promptDate("End date for the data span? (YYYY-MM-DD)");
  }

  // Analyzes standing data nodes to configure append vs overwrite choices
  const existing = await getUserCounts(db, userId);
  let wipeFirst = false;
  if (existing.accounts + existing.categories + existing.transactions > 0) {
    const action = bail(
      await p.select({
        message: `This user already has ${existing.accounts} accounts, ${existing.categories} categories, ${existing.transactions} transactions. What now?`,
        options: [
          { value: "append", label: "Append", hint: "Add new data on top" },
          { value: "wipe", label: "Wipe & reseed", hint: "Delete THIS user's data first" },
          { value: "cancel", label: "Cancel" },
        ],
      })
    ) as "append" | "wipe" | "cancel";

    if (action === "cancel") {
      p.cancel("Cancelled. Nothing was written.");
      process.exit(0);
    }
    wipeFirst = action === "wipe";
  }

  const targetLabel = createdCredentials
    ? `NEW Clerk user ${userId} (${createdCredentials.email})`
    : `existing user ${userId}`;

  // Prints the aggregated parameters sheet summary before initializing pipeline tasks
  p.note(
    [
      `Target:       ${targetLabel}`,
      `DB host:      ${dbHost(databaseUrl)}`,
      `Accounts:     ${accountCount}`,
      `Categories:   ${categoryCount}`,
      `Transactions: ${transactionCount}`,
      `Span:         ${startDate.toISOString().slice(0, 10)} -> ${endDate.toISOString().slice(0, 10)}`,
      `Mode:         ${wipeFirst ? "WIPE this user's data, then reseed" : "APPEND"}`,
    ].join("\n"),
    "About to write"
  );

  // Demands a final confirmation sequence match to authorize generation activity
  const confirm = bail(
    await p.text({
      message: "Type 'yes' to proceed",
      validate: (v) =>
        v.trim() === "yes" ? undefined : "Type exactly 'yes' to continue, or Ctrl-C to abort.",
    })
  );
  if (confirm.trim() !== "yes") {
    p.cancel("Aborted.");
    process.exit(0);
  }

  const s = p.spinner();
  s.start("Seeding...");

  try {
    // Executes data removal workflows when structural overwrite behaviors are selected
    if (wipeFirst) {
      s.message("Wiping existing data for this user...");
      await wipeUser(db, userId, existing.accountIds);
    }

    // Compiles fresh account records using real financial name mappings
    s.message("Creating accounts...");
    const accountNames = faker.helpers.shuffle(ACCOUNT_NAMES).slice(0, accountCount);
    while (accountNames.length < accountCount) {
      accountNames.push(`${faker.finance.accountName()} Account`);
    }
    const accountRows = accountNames.map((name) => {
      const type = ACCOUNT_TYPE_MAP[name] ?? "other";
      return {
        id: createId(),
        name,
        userId,
        plaidId: null,
        type,
        status: "active",
        description: ACCOUNT_TYPE_DESCRIPTIONS[type],
        notes: null,
      };
    });
    await chunkedInsert((chunk) => db.insert(accounts).values(chunk), accountRows);
    const accountIds = accountRows.map((a) => a.id);

    // Provisions core preference keys to ground localization utilities
    s.message("Setting currency preference...");
    await db.insert(userSettings).values({ userId, currency: SEED_CURRENCY }).onConflictDoNothing();

    // Balanced distribution builder that selects matching category types
    s.message("Creating categories...");
    const income = CATEGORY_CATALOG.filter((c) => c.type === "income");
    const expense = CATEGORY_CATALOG.filter((c) => c.type === "expense");
    const picked: CategoryTemplate[] = [
      faker.helpers.arrayElement(income),
      faker.helpers.arrayElement(expense),
    ];
    const remainingPool = CATEGORY_CATALOG.filter((c) => !picked.includes(c));
    picked.push(
      ...faker.helpers.shuffle(remainingPool).slice(0, Math.max(0, categoryCount - picked.length))
    );

    const categoryRows = picked.map((tpl) => ({
      id: createId(),
      name: tpl.name,
      userId,
      plaidId: null,
      type: tpl.type,
      color: tpl.color,
      description: tpl.description,
      notes: null,
    }));
    await chunkedInsert((chunk) => db.insert(categories).values(chunk), categoryRows);
    const categoryIdByName = new Map(categoryRows.map((r) => [r.name, r.id]));
    const selectedTemplates = picked;

    s.message("Creating transactions...");
    const txnRows: {
      id: string;
      amount: number;
      payee: string;
      notes: string | null;
      date: Date;
      accountId: string;
      categoryId: string;
    }[] = [];

    // Factory sub-routine generating randomized individual ledger profiles
    const makeTxn = (tpl: CategoryTemplate, date: Date) => {
      const baseAmount = faker.number.int({ min: tpl.min, max: tpl.max });
      const signed = tpl.type === "expense" ? -baseAmount : baseAmount;
      return {
        id: createId(),
        amount: convertAmountToMiliunits(signed),
        payee: faker.helpers.arrayElement(tpl.payees),
        notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.25 }) ?? null,
        date,
        accountId: faker.helpers.arrayElement(accountIds),
        categoryId: categoryIdByName.get(tpl.name)!,
      };
    };

    // Computes and injects static monthly recurring entries across the timeframe
    const recurringTemplates = selectedTemplates.filter((t) => t.recurring);
    const monthAnchors: Date[] = [];
    {
      const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      while (cursor <= endDate) {
        monthAnchors.push(new Date(cursor));
        cursor.setMonth(cursor.getMonth() + 1);
      }
    }
    for (const tpl of recurringTemplates) {
      const dayOfMonth = faker.number.int({ min: 1, max: 28 });
      for (const anchor of monthAnchors) {
        if (txnRows.length >= transactionCount) break;
        const d = new Date(anchor.getFullYear(), anchor.getMonth(), dayOfMonth);
        if (d < startDate || d > endDate) continue;
        txnRows.push(makeTxn(tpl, d));
      }
    }

    // Fills up remaining volumetric targets with scattered random transactions
    while (txnRows.length < transactionCount) {
      const tpl = faker.helpers.arrayElement(selectedTemplates);
      const date = faker.date.between({ from: startDate, to: endDate });
      txnRows.push(makeTxn(tpl, date));
    }

    // Executes chunk-partitioned database migrations for the generated transaction set
    await chunkedInsert((chunk) => db.insert(transactions).values(chunk), txnRows);

    s.stop("Seed complete.");

    // Prints configuration deployment receipts to terminal streams
    p.note(
      [
        `Accounts:     ${accountRows.length}`,
        `Categories:   ${categoryRows.length}`,
        `Transactions: ${txnRows.length}`,
      ].join("\n"),
      "Inserted"
    );

    // Exposes runtime dynamic user identity setups securely
    if (createdCredentials) {
      p.note(
        [`Email:    ${createdCredentials.email}`, `Password: ${createdCredentials.password}`].join(
          "\n"
        ),
        "Login credentials (Save these)"
      );
    }

    p.outro("Done. Sign in and check the dashboard.");
  } catch (err) {
    s.stop("Seeding failed.");
    const message = err instanceof Error ? err.message : String(err);
    p.cancel(`Error: ${message}`);
    process.exit(1);
  }
}

main();
