"use client";

import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

/**
 * Structural skeleton loader matching the header component's exact dimensions to prevent cumulative layout shift (CLS).
 */
export const HeaderSkeleton = () => {
  return (
    <header className="relative overflow-hidden bg-teal-600 px-6 py-8 pb-36 lg:px-14">
      {/* Decorative mobile grid matrix backdrop layout */}
      <BackgroundRippleEffect
        rows={12}
        cols={5}
        cellSize={76}
        className="[--cell-border-color:rgba(255,255,255,0.08)] [--cell-fill-color:rgba(255,255,255,0.02)] sm:hidden"
      />

      {/* Decorative desktop grid matrix backdrop layout */}
      <BackgroundRippleEffect
        rows={8}
        cols={22}
        cellSize={72}
        className="hidden [--cell-border-color:rgba(255,255,255,0.20)] [--cell-fill-color:rgba(255,255,255,0.06)] sm:block"
      />

      <div className="relative mx-auto max-w-screen-2xl">
        {/* Nav row wrapper duplicating layout spacing constraints across breakpoints */}
        <div className="mb-14 flex w-full items-center justify-between">
          {/* Mobile navigation placeholder */}
          <div className="flex items-center gap-x-4 lg:hidden">
            <div className="h-10 w-10 opacity-0" />
          </div>

          {/* Desktop logo and brand text layout frame bounds */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 opacity-0" />
              <div className="h-8 w-32 opacity-0" />
            </div>
          </div>

          {/* Desktop header menu text link placeholders */}
          <div className="hidden flex-1 justify-center lg:flex">
            <div className="flex items-center gap-x-4">
              <div className="h-6 w-20 opacity-0" />
              <div className="h-6 w-24 opacity-0" />
              <div className="h-6 w-20 opacity-0" />
              <div className="h-6 w-24 opacity-0" />
              <div className="h-6 w-18 opacity-0" />
            </div>
          </div>

          {/* Clerk profile image button and full name structural space bounds */}
          <div className="flex items-center gap-x-4">
            <div className="hidden h-6 w-32 opacity-0 md:block" />
            <div className="h-8 w-8 opacity-0" />
          </div>
        </div>

        {/* Personalized dashboard welcome text block layout bounds */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center">
            <div className="h-8 w-64 opacity-0 md:h-10 md:w-80" />
            <div className="ml-2 h-10 w-10 opacity-0" />
          </div>
          <div className="h-5 w-48 opacity-0 md:h-6 md:w-64" />
        </div>

        {/* Interactive account and date selection parameter bar placeholders */}
        <div className="flex flex-col items-center gap-y-2 md:flex-row md:gap-x-2 md:gap-y-0">
          <div className="h-10 w-full opacity-0 md:w-48" />
          <div className="h-10 w-full opacity-0 md:w-48" />
        </div>
      </div>
    </header>
  );
};
