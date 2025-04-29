"use client";

import { type ReactNode } from "react";
import { m, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Generates animation variants based on the system reduced motion preference.
 */
const buildVariants = (reduced: boolean): Variants => ({
  hidden: { opacity: 0, y: reduced ? 0 : 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.8, ease: "easeOut" },
  },
});

/**
 * Configuration properties for the `MotionSection` component.
 */
type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
};

/**
 * A container component that handles scroll-driven entry animations for layout blocks.
 */
export const MotionSection = ({
  children,
  className,
  delay = 0,
  as = "div",
}: MotionSectionProps) => {
  // Bypasses animations if the user prefers reduced interface motion.
  const reduced = useReducedMotion() ?? false;

  // Selects the appropriate motion element tag to match semantic HTML constraints.
  const MotionTag = as === "section" ? m.section : m.div;

  return (
    <MotionTag
      className={cn(className)}
      variants={buildVariants(reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: reduced ? 0 : delay }}
    >
      {children}
    </MotionTag>
  );
};

/**
 * Configuration properties for the `MotionGrid` component.
 */
type MotionGridProps = {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
};

/**
 * A grid wrapper component that orchestrates staggered entry animations for child elements.
 */
export const MotionGrid = ({
  children,
  className,
  delayChildren = 0.05,
  staggerChildren = 0.1,
}: MotionGridProps) => {
  // Disables staggered delays if the user prefers reduced interface motion.
  const reduced = useReducedMotion() ?? false;

  return (
    <m.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: reduced ? {} : { staggerChildren, delayChildren },
        },
      }}
    >
      {children}
    </m.div>
  );
};

/**
 * Configuration properties for the `MotionItem` component.
 */
type MotionItemProps = {
  children: ReactNode;
  className?: string;
};

/**
 * An individual target item that executes animations under a parent `MotionGrid` coordinator.
 */
export const MotionItem = ({ children, className }: MotionItemProps) => {
  // Adjusts state properties directly if the user prefers reduced interface motion.
  const reduced = useReducedMotion() ?? false;

  return (
    <m.div
      className={cn(className)}
      variants={{
        hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduced ? 0 : 0.8, ease: "easeOut" as const },
        },
      }}
    >
      {children}
    </m.div>
  );
};
