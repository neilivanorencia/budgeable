"use client";

import { useSearchParams } from "next/navigation";
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
import { PiMoney } from "react-icons/pi";

import { DataCard, DataCardLoading } from "@/components/data-card";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";

/**
 * A responsive layout grid that aggregates overview metric cards for income, expenses, and net remaining balances.
 */
export const DataGrid = () => {
  // Pulls processed aggregate totals directly from the asynchronous summary server query hook.
  const { data, isLoading } = useGetSummary();

  // Instantiates search context structures to format localized range text labels dynamically.
  const params = useSearchParams();
  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  // Renders structural placeholder skeleton elements if async requests have not finalized.
  if (isLoading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 pb-2 md:grid-cols-3 md:gap-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    );
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 pb-2 md:grid-cols-3 md:gap-8">
      {/* Dynamic metric displays passing individual financial vectors downstream */}
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
