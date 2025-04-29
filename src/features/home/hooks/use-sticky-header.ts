"use client";

import { useEffect, useState } from "react";

/**
 * Custom React hook that monitors window scroll position relative to a target element bounds.
 */
export const useStickyHeader = (triggerId = "hero") => {
  // Tracks whether the target header scroll threshold has been completely passed.
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    /**
     * Computes bounding client rect geometry parameters to determine sticky position status.
     */
    const check = () => {
      const trigger = document.getElementById(triggerId);
      setSticky(trigger ? trigger.getBoundingClientRect().bottom <= 0 : false);
    };

    // Forces an initial evaluation check to capture accurate layout states on mount.
    check();

    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [triggerId]);

  return sticky;
};
