"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { HeaderSkeleton } from "@/components/skeletons/header-skeleton";
import { DashboardSkeleton } from "@/components/skeletons/page-skeleton";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-200">
        <HeaderSkeleton />
        <main className="relative z-[1] px-6 lg:px-14">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200">
      <Header />
      <main className="relative z-[1] px-6 lg:px-14">{children}</main>
    </div>
  );
};

export default DashboardLayout;
