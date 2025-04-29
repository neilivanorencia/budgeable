"use client";

import { Loader2 } from "lucide-react";

import { Filter } from "@/components/filter";
import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import { WelcomeMessage } from "@/components/welcome-message";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { ClerkLoaded, ClerkLoading, UserButton, useUser } from "@clerk/nextjs";

/**
 * Presentational child component that extracts the authenticated user session context
 * and displays the user profile full name string on medium or larger viewports.
 */
const UserInfo = () => {
  // Pulls active user profile payload parameters directly from the authentication engine provider.
  const { user } = useUser();

  return (
    <span className="hidden text-base font-medium text-slate-200 md:inline">{user?.fullName}</span>
  );
};

/**
 * Global application layout header component rendering responsive navigation setups,
 * aesthetic background vectors, profile session buttons, and financial data filter layers.
 */
export const Header = () => {
  return (
    <header className="relative overflow-hidden bg-teal-600 px-6 py-8 pb-36 lg:px-14">
      {/* Decorative vector matrix explicitly designed and visible on mobile viewport structures */}
      <BackgroundRippleEffect
        rows={12}
        cols={5}
        cellSize={76}
        className="[--cell-border-color:rgba(255,255,255,0.08)] [--cell-fill-color:rgba(255,255,255,0.02)] sm:hidden"
      />

      {/* Expanded grid canvas sizing adjustments tailored strictly for small screens and upward */}
      <BackgroundRippleEffect
        rows={8}
        cols={22}
        cellSize={72}
        className="hidden [--cell-border-color:rgba(255,255,255,0.20)] [--cell-fill-color:rgba(255,255,255,0.06)] sm:block"
      />

      {/* Relative container framing brand elements and configuration tools cleanly above backdrop visuals */}
      <div className="relative mx-auto max-w-screen-2xl">
        {/* Core row grouping brand identifiers, site directory navigations, and profile controls */}
        <div className="mb-14 flex w-full items-center justify-between">
          {/* Responsive interaction menu container appearing exclusively on lower breakpoint ranges */}
          <div className="flex items-center gap-x-4 lg:hidden">
            <div className="hidden lg:block">
              <HeaderLogo />
            </div>
            <Navigation />
          </div>

          {/* Desktop logo alignment target optimized for wider screen orientations */}
          <div className="hidden lg:block">
            <HeaderLogo />
          </div>

          {/* Centered navigation panel holding internal page routing link mechanisms */}
          <div className="hidden flex-1 justify-center lg:flex">
            <Navigation />
          </div>

          {/* Session verification segment wrapping profile button graphics and async status icons */}
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

        {/* Personalized greeting block referencing active account variables */}
        <WelcomeMessage />

        {/* Interactive parameter bar filtering transactional datasets across timelines or accounts */}
        <Filter />
      </div>
    </header>
  );
};
