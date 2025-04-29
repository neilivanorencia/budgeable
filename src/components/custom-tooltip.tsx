import { format } from "date-fns";

import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/features/settings/hooks/use-currency";

/**
 * Structural shape of a single evaluation object provided within the Recharts array context.
 */
interface RechartsPayloadItem {
  payload: {
    date: Date;
  };
  value: number;
}

/**
 * Configuration properties for the `CustomTooltip` component.
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: RechartsPayloadItem[];
}

/**
 * A custom chart hover overlay that breaks down matching income and expense items on a targeted date.
 */
export const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  // Extracts currency formatting handlers tailored to match active user localization options.
  const { format: formatMoney } = useCurrency();

  // Evaluates internal status parameters to safeguard against null values during rendering cycles.
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // Deconstructs transactional date variables and metric values directly from the active payload fields.
  const date = payload[0].payload.date;
  const income = payload[0].value;
  const expense = payload.length > 1 && payload[1] ? payload[1].value : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_10px_15px_-3px_rgba(30,25,20,0.05),0_4px_6px_-4px_rgba(30,25,20,0.05)] md:border-2">
      {/* Date descriptive header showing the currently targeted timestamp string */}
      <div className="bg-teal-50/80 p-2 px-3 text-sm text-teal-700">
        {format(date, "MMM dd, yyyy")}
      </div>
      <Separator />

      {/* Visual content container translating raw values back into active financial strings */}
      <div className="space-y-1 p-2 px-3">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-teal-500" />
            <p className="text-muted-foreground text-sm">Income</p>
          </div>
          <p className="text-right text-sm">{formatMoney(income)}</p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-rose-500" />
            <p className="text-muted-foreground text-sm">Expenses</p>
          </div>
          <p className="text-right text-sm">{formatMoney(expense * -1)}</p>
        </div>
      </div>
    </div>
  );
};
