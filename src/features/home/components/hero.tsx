"use client";

import { Fragment } from "react";
import Link from "next/link";
import { type IconType } from "react-icons";
import { LuArrowRight, LuBadgeCheck, LuShieldCheck, LuZap } from "react-icons/lu";
import { HiOutlineChartBar } from "react-icons/hi2";
import { m, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Highlight } from "@/components/highlight";

/**
 * Defines the structural shape for value proposition markers displayed in the hero zone.
 */
type Capability = { icon: IconType; label: string };

/**
 * High-level core features list highlighting trust factors and automated mechanics.
 */
const capabilities: Capability[] = [
  { icon: LuBadgeCheck, label: "Free to use" },
  { icon: LuShieldCheck, label: "Secured by Plaid" },
  { icon: LuZap, label: "Auto-syncing" },
  { icon: HiOutlineChartBar, label: "Real-time insights" },
];

/**
 * Default animation time span in seconds for key entry phases.
 */
const DURATION = 0.8;

/**
 * The default vertical translation offset used for fade-up sequences.
 */
const Y = 24;

/**
 * Hero section serving as the primary entrance for the landing page.
 */
export const Hero = () => {
  // Checks device constraints or OS parameters to accommodate users who prefer reduced overall interface motion.
  const reduced = useReducedMotion() ?? false;

  /**
   * Constructs dynamic configuration parameters for Framer Motion transitions based on accessibility parameters.
   * @param delay - The time interval to wait before initiating the transition sequence.
   */
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : Y },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0 : DURATION,
      delay: reduced ? 0 : delay,
      ease: "easeOut" as const,
    },
  });

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-teal-600 pt-32 pb-20 lg:pt-40 lg:pb-28"
    >
      {/* Decorative background glows and ambient lighting structures */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 size-[30rem] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -top-20 right-[-10rem] size-[28rem] rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-white/8 blur-3xl" />
      </div>

      {/* Grid line overlay variations optimized to fit alternate device layout contexts */}
      <BackgroundRippleEffect
        rows={14}
        cols={5}
        cellSize={76}
        className="[--cell-border-color:rgba(255,255,255,0.20)] [--cell-fill-color:rgba(255,255,255,0.06)] sm:hidden dark:[--cell-border-color:rgba(255,255,255,0.20)] dark:[--cell-fill-color:rgba(255,255,255,0.06)]"
      />
      <BackgroundRippleEffect
        rows={10}
        cols={22}
        cellSize={72}
        className="hidden [--cell-border-color:rgba(255,255,255,0.20)] [--cell-fill-color:rgba(255,255,255,0.06)] sm:block dark:[--cell-border-color:rgba(255,255,255,0.20)] dark:[--cell-fill-color:rgba(255,255,255,0.06)]"
      />

      <div className="relative mx-auto max-w-screen-xl px-6 lg:px-14">
        <div className="mx-auto max-w-4xl text-center">
          {/* Displays the primary title highlighting the financial tracker tool */}
          <m.h1
            {...fadeUp(0)}
            className="font-manrope text-4xl leading-[1.3] font-semibold tracking-tighter text-white sm:text-6xl sm:leading-[1.2] lg:text-7xl"
          >
            A Simple Minimalistic{" "}
            <Highlight className="rounded-2xl md:rounded-3xl" tone="light">
              Financial Tracker
            </Highlight>
          </m.h1>

          {/* Details the product feature overview narrative regarding budgeting and automation */}
          <m.p
            {...fadeUp(0.22)}
            className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-teal-50/90 sm:text-lg"
          >
            Bring budgets, expenses, and bank accounts together in one clean dashboard. Connect your
            bank through Plaid to import transactions automatically, sort your spending into
            categories, and see exactly where your money goes every month.
          </m.p>

          {/* Renders the interactive buttons allowing users to register or learn more about the workflow */}
          <m.div
            {...fadeUp(0.44)}
            className="mt-10 flex flex-row items-center justify-center gap-2 sm:gap-3"
          >
            <Button
              asChild
              className="group h-10 cursor-pointer rounded-full bg-white !px-6 text-sm text-teal-600 shadow-sm hover:bg-teal-50 sm:h-14 sm:!px-10 sm:text-base"
            >
              <Link href="/signup">
                Get Started
                <LuArrowRight
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-10 cursor-pointer rounded-full border border-white/30 px-5 text-sm text-white hover:bg-white/10 hover:text-white sm:h-14 sm:px-8 sm:text-base"
            >
              <Link href="#how-it-works">How It Works</Link>
            </Button>
          </m.div>
        </div>

        {/* Displays the product features section using a blurred background grid container */}
        <m.div {...fadeUp(0.66)} className="mx-auto mt-12 max-w-5xl">
          <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 px-6 backdrop-blur-md sm:px-10">
            {/* Formats a static side-by-side icon list for wider desktop layouts */}
            <div className="hidden w-full items-stretch justify-evenly sm:flex">
              {capabilities.map(({ icon: Icon, label }, i) => (
                <Fragment key={label}>
                  {i > 0 && <span aria-hidden="true" className="w-[2px] bg-white/10" />}
                  <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-7">
                    <Icon className="size-9 text-white" aria-hidden="true" />
                    <span className="text-xs font-semibold tracking-wide text-white/80 uppercase">
                      {label}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>

            {/* Builds a marquee slider block to display capabilities smoothly on mobile screens */}
            <div
              className="overflow-hidden py-5 sm:hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
              }}
            >
              <div className="animate-marquee flex w-max">
                {/* Renders a twin duplication block to yield smooth looping behavior without clipping anomalies */}
                {[false, true].map((isClone, copyIdx) => (
                  <div
                    key={copyIdx}
                    className="flex shrink-0 items-center"
                    aria-hidden={isClone || undefined}
                  >
                    {capabilities.map(({ icon: Icon, label }, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 px-5">
                        <Icon className="size-9 text-white" aria-hidden="true" />
                        <span className="text-xs font-semibold tracking-tight whitespace-nowrap text-white/80 uppercase">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
};
