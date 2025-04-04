"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiMoney } from "react-icons/pi";
import { TbTransfer } from "react-icons/tb";
import { useMedia } from "react-use";

import { NavigationItem } from "@/components/navigation-item";

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

  if (isMobile) {
    return <div></div>;
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
