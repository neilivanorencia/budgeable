import { type IconType } from "react-icons";
import { LuLandmark, LuUserPlus } from "react-icons/lu";
import { HiOutlineChartBar } from "react-icons/hi2";

import { MotionSection, MotionGrid, MotionItem } from "@/components/motion-section";
import { Highlight } from "@/components/highlight";
import { SectionCard } from "@/features/home/components/section-card";

/**
 * Properties defining the contents of an individual onboarding walkthrough card.
 */
type Step = {
  icon: IconType;
  tag: string;
  title: string;
  description: string;
};

/**
 * Array containing the sequential milestones required to initialize setup.
 */
const steps: Step[] = [
  {
    icon: LuUserPlus,
    tag: "Sign Up",
    title: "Create your account",
    description:
      "Create a free account in seconds. No credit card required and no complicated setup standing between you and your first dashboard.",
  },
  {
    icon: LuLandmark,
    tag: "Connect",
    title: "Link your bank",
    description:
      "Securely connect your bank through Plaid. Transactions import automatically and stay up to date so your records are always accurate.",
  },
  {
    icon: HiOutlineChartBar,
    tag: "Track",
    title: "Track and budget",
    description:
      "Categorise spending, set budgets per category, and watch your dashboard update in real time as money flows in and out.",
  },
];

/**
 * Renders the explanatory sequence layout outlining the system initialization flow.
 */
export const Steps = () => {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-slate-100 pt-6 pb-20 lg:pt-10 lg:pb-28">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-14">
        {/* Renders standard description and context headings inside an animated frame layout */}
        <div className="mx-auto max-w-2xl text-center">
          <MotionSection delay={0.1}>
            <h2 className="font-manrope text-4xl leading-[1.3] font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Up and running in <Highlight className="text-slate-100">three steps</Highlight>
            </h2>
          </MotionSection>
          <MotionSection delay={0.3}>
            <p className="mt-6 text-base text-slate-600 sm:text-lg">
              Getting started takes minutes, not days. Connect your accounts and your finances are
              organised from day one.
            </p>
          </MotionSection>
        </div>

        {/* Displays onboarding sequence cards horizontally using a controlled motion orchestration grid */}
        <MotionGrid
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3"
          delayChildren={0.1}
          staggerChildren={0.1}
        >
          {steps.map((step, i) => (
            <MotionItem key={step.title} className="h-full">
              <SectionCard index={i} {...step} className="border-white md:border-white" />
            </MotionItem>
          ))}
        </MotionGrid>
      </div>
    </section>
  );
};
