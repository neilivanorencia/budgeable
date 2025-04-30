import { Metadata } from "next";

// Defines the static document window title configuration specifically for the settings section
export const metadata: Metadata = {
  title: "Settings • Budgeable",
};

/**
 * Structural layout shell enveloping the settings sub-domain pages.
 */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
