import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  label: string;
  isActive: boolean;
};

export const NavigationItem = ({ href, label, isActive }: Props) => {
  return (
    <Button
      asChild
      variant="outline"
      size="lg"
      className={cn(
        "w-full justify-between border-none px-4 py-2 text-base text-slate-200 transition-all duration-200 hover:bg-white/15 hover:text-slate-200 hover:shadow-sm focus:ring-2 focus:ring-slate-100 focus:ring-offset-2 lg:w-auto ease-in-out",
        isActive ? "bg-white/20" : "bg-transparent"
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
