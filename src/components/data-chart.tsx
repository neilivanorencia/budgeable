"use client";

import { Chart, ChartLoading } from "@/components/chart";
import { CircularChart, CircularChartLoading } from "@/components/circular-chart";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

/**
 * Coordinated layout block that handles the concurrent side-by-side display of grid metrics charts.
 */
export const DataChart = () => {
  // Pulls processed summary values directly from the asynchronous data query hook.
  const { data, isLoading } = useGetSummary();

  // Renders synchronized skeleton load panels if asynchronous tasks remain unfinished.
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <ChartLoading />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <CircularChartLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
      {/* Renders chronological trend graphics tracking timeline parameters */}
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.days} />
      </div>

      {/* Renders circular categorical charts illustrating value distributions */}
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <CircularChart data={data?.categories} />
      </div>
    </div>
  );
};
