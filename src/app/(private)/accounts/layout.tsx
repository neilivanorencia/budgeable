import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accounts • Budgeable",
};

export default function AccountsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
