"use client";

import { Loader2 } from "lucide-react";

import { Filter } from "@/components/filter";
import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import { WelcomeMessage } from "@/components/welcome-message";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { ClerkLoaded, ClerkLoading, UserButton, useUser } from "@clerk/nextjs";

const UserInfo = () => {
  const { user } = useUser();

  return (
    <span className="hidden text-base font-medium text-slate-200 md:inline">{user?.fullName}</span>
  );
};

export const Header = () => {
  return (
    <header className="relative overflow-hidden bg-teal-600 px-6 py-8 pb-36 lg:px-14">
      <BackgroundRippleEffect
        rows={12}
        cols={5}
        cellSize={76}
        className="[--cell-border-color:rgba(255,255,255,0.08)] [--cell-fill-color:rgba(255,255,255,0.02)] sm:hidden"
      />
      <BackgroundRippleEffect
        rows={8}
        cols={22}
        cellSize={72}
        className="hidden [--cell-border-color:rgba(255,255,255,0.20)] [--cell-fill-color:rgba(255,255,255,0.06)] sm:block"
      />
      <div className="relative mx-auto max-w-screen-2xl">
        <div className="mb-14 flex w-full items-center justify-between">
          <div className="flex items-center gap-x-4 lg:hidden">
            <div className="hidden lg:block">
              <HeaderLogo />
            </div>
            <Navigation />
          </div>

          <div className="hidden lg:block">
            <HeaderLogo />
          </div>

          <div className="hidden flex-1 justify-center lg:flex">
            <Navigation />
          </div>

          <div className="flex items-center gap-x-4">
            <ClerkLoaded>
              <UserInfo />
              <UserButton />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="size-8 animate-spin text-slate-200" />
            </ClerkLoading>
          </div>
        </div>
        <WelcomeMessage />
        <Filter />
      </div>
    </header>
  );
};
