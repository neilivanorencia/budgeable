"use client";

import { MenuIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BsArrowRightShort } from "react-icons/bs";
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
    href: "/dashboard",
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
        <SheetContent side="left" className="bg-teal-50 px-4 pt-6">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <Image
              src="/icon.svg"
              alt="Budgeable Logo"
              width={100}
              height={100}
              className="size-10"
            />
            <h1 className="font-manrope bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-xl font-bold tracking-wide text-transparent uppercase sm:text-2xl">
              Budgeable
            </h1>
          </div>
          <div className="mb-4 h-px w-full bg-teal-200/70" />
          <nav className="flex flex-col gap-y-4">
            {routes.map((route) => {
              const isActive = route.href === pathname;
              return (
                <Button
                  size="lg"
                  variant="ghost"
                  key={route.href}
                  onClick={() => onClick(route.href)}
                  className={`group relative w-full cursor-pointer justify-start rounded-lg py-6 text-sm font-normal text-slate-700 sm:py-8 sm:text-base ${
                    isActive
                      ? "bg-teal-500 font-normal text-white shadow-lg shadow-teal-200/50 hover:bg-teal-500 hover:text-white"
                      : "bg-transparent hover:bg-teal-200/50 hover:text-slate-800"
                  }`}
                >
                  <div
                    className={`mr-1 flex items-center justify-center rounded-full p-2 transition-colors sm:mr-3 ${
                      isActive ? "bg-white" : "bg-slate-200 group-hover:bg-white"
                    }`}
                  >
                    {route.icon && (
                      <route.icon
                        className={`size-4 sm:size-5 ${isActive ? "text-teal-500" : "text-slate-800"}`}
                      />
                    )}
                  </div>
                  {route.label}
                  <BsArrowRightShort
                    className={`absolute right-4 size-6 ${isActive ? "animate-pulse text-white" : "opacity-0"}`}
                  />
                </Button>
              );
            })}
          </nav>
          <div className="absolute right-0 bottom-6 left-0 px-4">
            <div className="mb-4 h-px w-full bg-teal-200/70" />
            <p className="text-center text-xs tracking-wide text-slate-500 sm:text-sm">
              Copyright © {new Date().getFullYear()} Budgeable
            </p>
          </div>
        </SheetContent>
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
