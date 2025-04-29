"use client";

import { type ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Properties for the `Highlight` component.
 */
type HighlightProps = {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "light";
};

/**
 * Maps design configuration keys to specific background gradients and text colors.
 */
const toneClasses = {
  brand: "bg-gradient-to-r from-teal-500 to-emerald-500 text-white",
  light: "bg-gradient-to-r from-white to-white text-teal-600",
} as const;

/**
 * Renders an animated text accent that sweeps a background color into view.
 */
export const Highlight = ({ children, className, tone = "brand" }: HighlightProps) => {
  // Checks system preferences to optionally disable motion effects for accessibility.
  const reduced = useReducedMotion() ?? false;

  return (
    <m.span
      initial={{ backgroundSize: reduced ? "100% 100%" : "0% 100%" }}
      whileInView={{ backgroundSize: "100% 100%" }}
      viewport={{ once: true }}
      transition={{
        duration: reduced ? 0 : 0.9,
        ease: "easeInOut",
        delay: reduced ? 0 : 0.25,
      }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
      className={cn("rounded-2xl px-3 pb-1", toneClasses[tone], className)}
    >
      {/* Applies an opacity fade to the text wrapper only when using the light layout theme */}
      {tone === "light" ? (
        <m.span
          initial={{ opacity: reduced ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: reduced ? 0 : 0.5,
            ease: "easeIn",
          }}
        >
          {children}
        </m.span>
      ) : (
        children
      )}
    </m.span>
  );
};
