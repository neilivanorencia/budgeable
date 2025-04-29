import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { MotionSection } from "@/components/motion-section";

/**
 * Renders the call to action section containing account creation links and decorative backdrop elements.
 */
export const CallToAction = () => {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-14">
        <div className="relative overflow-hidden rounded-4xl bg-teal-600 px-6 py-16 text-center shadow-[0_20px_60px_-10px_rgba(20,184,166,0.45)] lg:px-16 lg:py-20">
          {/* Displays layout grid overlay variations tailored to match modern device contexts */}
          <BackgroundRippleEffect
            rows={10}
            cols={5}
            cellSize={76}
            className="[--cell-border-color:rgba(255,255,255,0.20)] [--cell-fill-color:rgba(255,255,255,0.06)] sm:hidden dark:[--cell-border-color:rgba(255,255,255,0.20)] dark:[--cell-fill-color:rgba(255,255,255,0.06)]"
          />
          <BackgroundRippleEffect
            rows={7}
            cols={18}
            cellSize={72}
            className="hidden [--cell-border-color:rgba(255,255,255,0.20)] [--cell-fill-color:rgba(255,255,255,0.06)] sm:block dark:[--cell-border-color:rgba(255,255,255,0.20)] dark:[--cell-fill-color:rgba(255,255,255,0.06)]"
          />

          {/* Renders an absolute top gradient fill layer for structural ambient illumination styles */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(255,255,255,0.25),transparent_70%)]"
          />

          {/* Core conversational target header displaying promotional copy strings */}
          <MotionSection delay={0.1} className="relative">
            <h2 className="font-manrope mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Start tracking your money today
            </h2>
          </MotionSection>

          {/* Descriptive summary paragraph illustrating onboarding utility points */}
          <MotionSection delay={0.3} className="relative">
            <p className="mx-auto mt-4 max-w-xl text-sm text-teal-50/90 md:text-base">
              Create a free account and bring your budgets, transactions and accounts together in
              one place.
            </p>
          </MotionSection>

          {/* Navigation link elements guiding users to respective onboarding paths */}
          <MotionSection delay={0.5} className="relative">
            <div className="mt-8 flex flex-row items-center justify-center gap-2 sm:gap-3">
              <Button
                asChild
                className="group h-10 rounded-lg bg-white !px-4 text-sm text-teal-700 shadow-sm hover:bg-teal-50 sm:h-12 sm:text-base"
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
                className="h-10 rounded-lg border border-white/30 px-4 text-sm text-white hover:bg-white/10 hover:text-white sm:h-12 sm:px-7 sm:text-base"
              >
                <Link href="/signin">Sign in</Link>
              </Button>
            </div>
          </MotionSection>
        </div>
      </div>
    </section>
  );
};
