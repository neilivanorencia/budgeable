"use client";

import { MenuIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiMoney } from "react-icons/pi";
import { TbTransfer } from "react-icons/tb";
import { useMedia } from "react-use";

import { NavigationItem } from "@/components/navigation-item";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const routes = [
  {
    href: "/",
    label: "Dashboard",
    icon: LuLayoutDashboard,
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: TbTransfer,
  },
  {
    href: "/accounts",
    label: "Accounts",
    icon: IoPersonOutline,
  },
  {
    href: "/categories",
    label: "Categories",
    icon: PiMoney,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: IoSettingsOutline,
  },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const isMobile = useMedia("(max-width: 1024px)", false);
  const pathname = usePathname();

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant="outline"
            className="cursor-pointer border-none bg-white/20 text-slate-200 transition duration-200 ease-in-out outline-none hover:bg-white/30 hover:text-slate-200 focus:ring-2 focus:ring-slate-100 focus:ring-offset-2"
          >
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-teal-50 px-4 pt-6"></SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden items-center gap-x-4 overflow-x-auto lg:flex">
      {routes.map((route) => (
        <NavigationItem
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
};
