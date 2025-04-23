"use client";

import { DataChart } from "@/components/data-chart";
import { DataGrid } from "@/components/data-grid";
import { DashboardSkeleton } from "@/components/skeletons/page-skeleton";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

export default function DashboardPage() {
  const { isLoading } = useGetSummary();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <DataGrid />
      <DataChart />
    </div>
  );
}
