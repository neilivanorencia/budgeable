import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories • Budgeable",
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
