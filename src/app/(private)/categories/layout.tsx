import { Metadata } from "next";

// Defines the static document window title configuration specifically for the categories section
export const metadata: Metadata = {
  title: "Categories • Budgeable",
};

/**
 * Structural layout shell enveloping the financial categories sub-domain pages.
 */
export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
