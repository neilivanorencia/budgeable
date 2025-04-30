import { Metadata } from "next";

// Defines the static document window title configuration specifically for the accounts section
export const metadata: Metadata = {
  title: "Accounts • Budgeable",
};

/**
 * Structural layout shell enveloping the financial accounts sub-domain pages.
 */
export default function AccountsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
