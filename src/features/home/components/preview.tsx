import Image from "next/image";

import { MotionSection } from "@/components/motion-section";
import { Highlight } from "@/components/highlight";

/**
 * Renders a preview image showcasing the authenticated interface of the platform.
 */
export const Preview = () => {
  return (
    <section
      id="preview"
      className="relative scroll-mt-24 overflow-hidden bg-slate-100 pt-20 pb-16 lg:pt-28 lg:pb-20"
    >
      <div className="relative mx-auto max-w-screen-xl px-6 lg:px-14">
        {/* Renders the central typography block containing localized copy and contextual features description */}
        <div className="mx-auto max-w-2xl text-center">
          <MotionSection delay={0.1}>
            <h2 className="font-manrope text-4xl leading-[1.3] font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Your whole financial picture,{" "}
              <Highlight className="text-slate-100">in one view</Highlight>
            </h2>
          </MotionSection>
          <MotionSection delay={0.3}>
            <p className="mt-6 text-base text-slate-600 sm:text-lg">
              Balances, spending charts and recent transactions update together, so you always know
              exactly where you stand.
            </p>
          </MotionSection>
        </div>

        {/* Displays the visual layer wrapped within simulated application control frames */}
        <MotionSection delay={0.45} className="relative mx-auto mt-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(20,184,166,0.18),transparent_70%)]"
          />
          <div className="relative overflow-hidden rounded-2xl border bg-white shadow-2xl ring-1 shadow-slate-900/10 ring-slate-900/5 md:rounded-3xl">
            <div className="flex items-center gap-1.5 px-3 py-2.5 md:px-6 md:py-4">
              <span className="size-2.5 rounded-full bg-rose-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-emerald-400" />
            </div>
            <Image
              src="/website-preview.png"
              alt="Budgeable Preview"
              width={2400}
              height={1260}
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="h-auto w-full"
            />
          </div>
        </MotionSection>
      </div>
    </section>
  );
};
