"use client";

import { useSearchParams } from "next/navigation";
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
import { PiMoney } from "react-icons/pi";

import { DataCard, DataCardLoading } from "@/components/data-card";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";

export const DataGrid = () => {
  const { data, isLoading } = useGetSummary();

  const params = useSearchParams();
  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-4 pb-2 md:grid-cols-3 md:gap-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 pb-2 md:grid-cols-3 md:gap-8">
      <DataCard
        title="Budget"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={IoIosTrendingUp}
        dateRange={dateRangeLabel}
        variant="default"
      />
      <DataCard
        title="Expenses"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={IoIosTrendingDown}
        dateRange={dateRangeLabel}
        variant="default"
      />
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={PiMoney}
        dateRange={dateRangeLabel}
        variant="default"
      />
    </div>
  );
};
