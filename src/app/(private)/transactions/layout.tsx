import { Metadata } from "next";

// Defines the static document window title configuration specifically for the transactions section
export const metadata: Metadata = {
  title: "Transactions • Budgeable",
};

/**
 * Structural layout shell enveloping the transaction sub-domain pages.
 */
export default function TransactionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
