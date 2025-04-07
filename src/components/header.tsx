"use client";

import { Loader2 } from "lucide-react";

import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import { WelcomeMessage } from "@/components/welcome-message";
import { ClerkLoaded, ClerkLoading, UserButton, useUser } from "@clerk/nextjs";

const UserInfo = () => {
  const { user } = useUser();

  return (
    <span className="hidden text-base font-medium text-slate-200 md:inline">{user?.fullName}</span>
  );
};

export const Header = () => {
  return (
    <header className="bg-teal-600 bg-[url('/topography.svg')] bg-repeat px-4 py-8 pb-36 bg-blend-soft-light lg:px-14">
      <div className="mx-auto max-w-screen-2xl">
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
      </div>
    </header>
  );
};
