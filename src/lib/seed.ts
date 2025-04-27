import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import { neon } from "@neondatabase/serverless";

import { accounts, categories, transactions, userSettings } from "@/db/schema";
import { convertAmountToMiliunits } from "@/lib/utils";

export function loadEnv() {
  config({ path: ".env" });

  const databaseUrl = process.env.DATABASE_URL;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing from .env. Cannot connect to the database.");
  }
  if (!clerkSecretKey) {
    throw new Error("CLERK_SECRET_KEY is missing from .env. Cannot manage Clerk users.");
  }

  return { databaseUrl, clerkSecretKey };
}

export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl);
  return drizzle({ client: sql });
}

export function dbHost(databaseUrl: string) {
  try {
    return new URL(databaseUrl).host;
  } catch {
    return "unknown-host";
  }
}

export { accounts, categories, transactions, userSettings, convertAmountToMiliunits };

export const SEED_CURRENCY = "USD";

export type CategoryType = "income" | "expense";

export interface CategoryTemplate {
  name: string;
  type: CategoryType;
  payees: string[];
  min: number;
  max: number;
  recurring?: boolean;
  color: string;
  description: string;
}

export const CATEGORY_CATALOG: CategoryTemplate[] = [
  {
    name: "Salary",
    type: "income",
    payees: [
      "Acme Corp Payroll",
      "Globex Payroll",
      "Initech HR",
      "Stark Industries",
      "Umbrella Co Payroll",
    ],
    min: 2_800,
    max: 5_200,
    recurring: true,
    color: "#10b981",
    description: "Regular salary and wage payouts from employment",
  },
  {
    name: "Freelance",
    type: "income",
    payees: ["Upwork", "Fiverr", "Toptal", "Freelancer", "Direct Client"],
    min: 120,
    max: 900,
    color: "#14b8a6",
    description: "Revenue generated from freelance contracts and project gigs",
  },
  {
    name: "Investments",
    type: "income",
    payees: ["Vanguard", "Fidelity", "Robinhood", "Dividend Payout", "Bank Interest"],
    min: 10,
    max: 250,
    color: "#06b6d4",
    description: "Returns from dividends, interest, or other investment payouts",
  },
  {
    name: "Rent",
    type: "expense",
    payees: ["Property Management", "Apartment Lease", "Landlord"],
    min: 900,
    max: 1_900,
    recurring: true,
    color: "#6366f1",
    description: "Monthly rental fees and housing expenditures",
  },
  {
    name: "Groceries",
    type: "expense",
    payees: ["Walmart", "Costco", "Tesco", "Carrefour", "Aldi", "Whole Foods"],
    min: 15,
    max: 160,
    color: "#f59e0b",
    description: "Groceries, household items, and everyday essentials",
  },
  {
    name: "Dining",
    type: "expense",
    payees: ["McDonald's", "Starbucks", "Subway", "KFC", "Pizza Hut", "Domino's"],
    min: 6,
    max: 55,
    color: "#f97316",
    description: "Dining out, coffee shops, and food delivery",
  },
  {
    name: "Transport",
    type: "expense",
    payees: ["Uber", "Lyft", "Bolt", "Shell", "BP", "Metro Transit"],
    min: 3,
    max: 70,
    color: "#0ea5e9",
    description: "Commuting expenses, fuel, public transit, and ride-hailing services",
  },
  {
    name: "Utilities",
    type: "expense",
    payees: ["Electric Company", "Water Utility", "Comcast", "AT&T", "Vodafone"],
    min: 35,
    max: 220,
    recurring: true,
    color: "#8b5cf6",
    description:
      "Recurring household utilities including electricity, water, internet, and phone bills",
  },
  {
    name: "Shopping",
    type: "expense",
    payees: ["Amazon", "eBay", "IKEA", "Zara", "H&M", "Best Buy"],
    min: 12,
    max: 320,
    color: "#ec4899",
    description: "General retail purchases, apparel, and electronic items",
  },
  {
    name: "Health",
    type: "expense",
    payees: ["CVS Pharmacy", "Walgreens", "Boots", "City Clinic", "Dental Care"],
    min: 10,
    max: 280,
    color: "#ef4444",
    description: "Medical care, pharmacy prescriptions, and dental treatments",
  },
  {
    name: "Entertainment",
    type: "expense",
    payees: ["Netflix", "Spotify", "Disney+", "Steam", "Cinema"],
    min: 8,
    max: 60,
    color: "#a855f7",
    description: "Leisure activities, streaming subscriptions, gaming, and entertainment",
  },
  {
    name: "Education",
    type: "expense",
    payees: ["Udemy", "Coursera", "Skillshare", "Bookstore", "Tuition"],
    min: 15,
    max: 260,
    color: "#3b82f6",
    description: "Educational expenses, training courses, books, and tuition fees",
  },
  {
    name: "Travel",
    type: "expense",
    payees: ["Airbnb", "Booking.com", "Expedia", "Delta Airlines", "Marriott"],
    min: 80,
    max: 950,
    color: "#f43f5e",
    description: "Travel accommodations, flights, and holiday expenditures",
  },
  {
    name: "Insurance",
    type: "expense",
    payees: ["Geico", "Allianz", "AXA", "Health Insurance", "Auto Insurance"],
    min: 40,
    max: 300,
    recurring: true,
    color: "#64748b",
    description: "Regular insurance premiums for health, auto, and property coverage",
  },
];

export type AccountType =
  | "cash"
  | "checking"
  | "savings"
  | "credit"
  | "investment"
  | "ewallet"
  | "other";

export const ACCOUNT_TYPE_MAP: Record<string, AccountType> = {
  "Checking Account": "checking",
  "Savings Account": "savings",
  "Chase Checking": "checking",
  "Bank of America Savings": "savings",
  PayPal: "ewallet",
  "Wise Account": "ewallet",
  Revolut: "ewallet",
  "Credit Card": "credit",
  "Visa Debit": "checking",
  "Cash Wallet": "cash",
};

export const ACCOUNT_TYPE_DESCRIPTIONS: Record<AccountType, string> = {
  cash: "Physical currency and coins",
  checking: "Primary account for daily transaction and spending operations",
  savings: "Interest-bearing account for accumulated funds",
  credit: "Credit lines and credit card balances",
  investment: "Brokerage portfolios, assets, and investment holdings",
  ewallet: "Digital payment platforms and online wallets",
  other: "Miscellaneous or custom account type",
};
