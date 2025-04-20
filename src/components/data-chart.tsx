"use client";

import { Chart, ChartLoading } from "@/components/chart";
import { CircularChart, CircularChartLoading } from "@/components/circular-chart";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

export const DataChart = () => {
  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <CircularChart data={data?.categories} />
      </div>
    </div>
  );
};
