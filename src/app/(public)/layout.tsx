"use client";

import { type ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

/**
 * High-level layout template wrapper designed to isolate client-side route pages.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    /* Encapsulates tree nodes to restrict framer-motion bundles strictly to DOM configurations */
    <LazyMotion features={domAnimation}>{children}</LazyMotion>
  );
}
