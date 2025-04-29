import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Properties for establishing individual route anchors.
 */
type Props = {
  href: string;
  label: string;
  isActive: boolean;
};

/**
 * Renders an interactive navigation bar anchor link paired with high-contrast active overlay values.
 */
export const NavigationItem = ({ href, label, isActive }: Props) => {
  return (
    <Button
      asChild
      variant="outline"
      size="lg"
      className={cn(
        "w-full justify-between border-none px-4 py-2 text-base text-slate-200 transition-all duration-200 ease-in-out hover:bg-white/15 hover:text-slate-200 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-slate-100 focus-visible:ring-offset-0 lg:w-auto",
        isActive ? "bg-white/20" : "bg-transparent"
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
