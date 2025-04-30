"use client";

import { DataChart } from "@/components/data-chart";
import { DataGrid } from "@/components/data-grid";
import { DashboardSkeleton } from "@/components/skeletons/page-skeleton";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

/**
 * Main dashboard application page displaying analytical asset overviews.
 */
export default function DashboardPage() {
  // Queries aggregated financial transaction data logs from the backend endpoint hook
  const { isLoading } = useGetSummary();

  // Renders baseline placeholder block frames while transaction metrics fetch over the network
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      {/* Top dashboard grid row displaying individual stat cards */}
      <DataGrid />
      {/* Lower dashboard visualization block showing data trends over time and category distributions */}
      <DataChart />
    </div>
  );
}
