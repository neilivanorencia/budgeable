"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStickyHeader } from "@/features/home/hooks/use-sticky-header";
import { useActiveSection } from "@/features/home/hooks/use-active-section";

/**
 * Anchor configurations pointing to sections on the landing page layout.
 */
const navigationLinks = [
  { label: "Features", href: "#features" },
  { label: "Preview", href: "#preview" },
  { label: "How it works", href: "#how-it-works" },
];

/**
 * Parsed array of target DOM identifiers extracted from navigation configurations.
 */
const sectionIds = navigationLinks.map((l) => l.href.slice(1));

type NavigationContentProps = {
  onDark: boolean;
  activeSection: string;
  dotPrefix: string;
};

/**
 * Renders internal layout contents including brand signatures, dynamic links, and target action controls.
 */
const NavigationContent = ({ onDark, activeSection, dotPrefix }: NavigationContentProps) => (
  <nav className="mx-auto flex h-20 max-w-screen-xl items-center justify-between px-6 lg:px-14">
    {/* Interactive core brand logo routing back to root landing paths */}
    <Link href="/" className="flex items-center gap-2.5" aria-label="Budgeable home">
      <Image
        src="/icon.svg"
        alt=""
        width={100}
        height={100}
        className="size-8 transition-transform hover:scale-105"
      />
      <span
        className={cn(
          "font-manrope text-lg font-bold tracking-wide uppercase md:text-2xl",
          onDark ? "text-white" : "text-slate-900"
        )}
      >
        Budgeable
      </span>
    </Link>

    {/* Center navigation block displaying localized viewport monitoring layouts */}
    <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-x-8 md:flex">
      {navigationLinks.map(({ label, href }) => {
        const sectionId = href.slice(1);
        const isActive = activeSection === sectionId;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative text-sm transition-colors md:text-base",
              onDark
                ? isActive
                  ? "text-white"
                  : "text-white/80 hover:text-white"
                : isActive
                  ? "text-teal-600"
                  : "text-slate-600 hover:text-teal-600"
            )}
          >
            {label}
            {/* Animates an indicator dot beneath the active section anchor element */}
            {isActive && (
              <m.span
                layoutId={`${dotPrefix}-dot`}
                className={cn(
                  "absolute -bottom-3 left-1/2 size-1.5 -translate-x-1/2 rounded-full",
                  onDark ? "bg-white/80" : "bg-teal-500"
                )}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>

    {/* Navigation user auth action control button */}
    <Button
      asChild
      className={cn(
        "h-10 rounded-full px-5 text-sm transition-colors md:text-base",
        onDark
          ? "bg-white text-teal-600 hover:bg-teal-50"
          : "bg-teal-600 text-white shadow-teal-600/20 hover:bg-teal-700"
      )}
    >
      <Link href="/signin">Sign In</Link>
    </Button>
  </nav>
);

/**
 * Top-level application navbar that transitions upon scrolling past the hero fold.
 */
export const NavigationBar = () => {
  const sticky = useStickyHeader("hero");
  const activeSection = useActiveSection(sectionIds);

  return (
    <>
      {/* Absolute static container header overlaid cleanly onto the raw backdrop hero section */}
      <header className="absolute inset-x-0 top-0 z-50 border-b border-transparent">
        <NavigationContent onDark={true} activeSection={activeSection} dotPrefix="abs" />
      </header>

      {/* Conditionally attaches sliding sticky headers depending on monitored intersection thresholds */}
      <AnimatePresence>
        {sticky && (
          <m.header
            key="sticky-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/80 shadow-[0_10px_15px_-3px_rgba(30,25,20,0.05),0_4px_6px_-4px_rgba(30,25,20,0.05)] backdrop-blur-md"
          >
            <NavigationContent onDark={false} activeSection={activeSection} dotPrefix="sticky" />
          </m.header>
        )}
      </AnimatePresence>
    </>
  );
};
