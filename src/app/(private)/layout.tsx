"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { HeaderSkeleton } from "@/components/skeletons/header-skeleton";
import { DashboardSkeleton } from "@/components/skeletons/page-skeleton";

type Props = {
  children: React.ReactNode;
};

/**
 * Global wrapper layout component for the dashboard user interface.
 */
const DashboardLayout = ({ children }: Props) => {
  // Tracking state to determine if the layout has mounted on the client view
  const [isMounted, setIsMounted] = useState(false);

  // Sets the `isMounted` flag to `true` after the initial client-side render pass
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Renders structural placeholder skeleton frames during pre-rendering to eliminate layout shift
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-200">
        {/* Fallback structural navigation header layout box */}
        <HeaderSkeleton />
        {/* Main layout container wrapping placeholder content wireframes */}
        <main className="relative z-[1] px-6 lg:px-14">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200">
      {/* Primary global navigation interface header */}
      <Header />
      {/* Main layout container hosting active child node views */}
      <main className="relative z-[1] px-6 lg:px-14">{children}</main>
    </div>
  );
};

export default DashboardLayout;
