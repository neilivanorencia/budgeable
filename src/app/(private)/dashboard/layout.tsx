import { Metadata } from "next";

// Defines the static document window title configuration specifically for the main dashboard overview
export const metadata: Metadata = {
  title: "Dashboard • Budgeable",
};

/**
 * Structural layout shell enveloping the main dashboard sub-domain pages.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
