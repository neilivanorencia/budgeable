"use client";

import { useEffect, useState } from "react";

/**
 * Custom React hook that monitors window scroll positions to determine which DOM section
 * is currently occupying a specified vertical intersection ratio threshold in the viewport.
 */
export const useActiveSection = (sectionIds: string[], ratio = 0.4) => {
  // Tracks the element identifier string of the currently active viewpoint section.
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    /**
     * Loops through target container nodes to find which section boundary intersects the ratio threshold.
     */
    const updateActive = () => {
      const mid = window.innerHeight * ratio;
      let active = "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        // Extracts current geometric bounding relative coordinate frames from the layout.
        const { top, bottom } = el.getBoundingClientRect();

        // Verifies if the target element bounds clip across the vertical intersection threshold.
        if (top <= mid && bottom > mid) {
          active = id;
          break;
        }
      }

      setActiveSection(active);
    };

    // Forces an initial execution check to capture accurate layout states on mount.
    updateActive();

    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [sectionIds, ratio]);

  return activeSection;
};
