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
      <div className="min-h-screen bg-gray-50">
        <HeaderSkeleton />
        <main className="px-6 lg:px-14">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="px-6 lg:px-14">{children}</main>
    </>
  );
};

export default DashboardLayout;
