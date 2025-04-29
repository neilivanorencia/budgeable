import { type IconType } from "react-icons";
import {
  LuArrowLeftRight,
  LuFileUp,
  LuLandmark,
  LuLayoutDashboard,
  LuTags,
  LuWallet,
} from "react-icons/lu";

import { MotionSection, MotionGrid, MotionItem } from "@/components/motion-section";
import { Highlight } from "@/components/highlight";
import { SectionCard } from "@/features/home/components/section-card";

/**
 * Defines the structural type for individual product features detailing capabilities.
 */
type Feature = {
  icon: IconType;
  tag: string;
  title: string;
  description: string;
};

/**
 * A collection of available feature specifications highlighting platform traits.
 */
const features: Feature[] = [
  {
    icon: LuLayoutDashboard,
    tag: "Overview",
    title: "Dashboard and insights",
    description:
      "See balances, income and spending at a glance, with clear charts that summarise your finances.",
  },
  {
    icon: LuArrowLeftRight,
    tag: "Activity",
    title: "Transactions",
    description:
      "Record income and expenses, filter by account or period, and keep an accurate running history.",
  },
  {
    icon: LuWallet,
    tag: "Planning",
    title: "Budgets",
    description:
      "Set monthly budgets per category and track how much you have left before you overspend.",
  },
  {
    icon: LuLandmark,
    tag: "Banking",
    title: "Bank sync via Plaid",
    description:
      "Connect your bank account through Plaid so transactions stay up to date automatically.",
  },
  {
    icon: LuFileUp,
    tag: "Import",
    title: "Import your files",
    description:
      "Bring in existing records by uploading your statement files, no manual re-entry required.",
  },
  {
    icon: LuTags,
    tag: "Organize",
    title: "Categories",
    description:
      "Organise spending into categories to understand exactly where your money goes each month.",
  },
];

/**
 * Renders the overview layout using dynamic animations to reveal platform features.
 */
export const Features = () => {
  return (
    <section id="features" className="relative scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-14">
        {/* Renders the top intro text container and informational titles with motion properties */}
        <div className="mx-auto max-w-2xl text-center">
          <MotionSection delay={0.1}>
            <h2 className="font-manrope text-4xl leading-[1.3] font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Built around <Highlight>how you spend</Highlight>
            </h2>
          </MotionSection>
          <MotionSection delay={0.3}>
            <p className="mt-6 text-base text-slate-600 sm:text-lg">
              Every feature is designed around one goal which is helping you stay on top of your
              money without the spreadsheet.
            </p>
          </MotionSection>
        </div>

        {/* Displays the product features inside an animated stagger grid layout component */}
        <MotionGrid
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          delayChildren={0.15}
          staggerChildren={0.12}
        >
          {features.map((feature, i) => (
            <MotionItem key={feature.title} className="h-full">
              <SectionCard index={i} {...feature} />
            </MotionItem>
          ))}
        </MotionGrid>
      </div>
    </section>
  );
};
