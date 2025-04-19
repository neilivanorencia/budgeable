import { format } from 'date-fns';

import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

interface RechartsPayloadItem {
  payload: {
    date: Date;
  };
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: RechartsPayloadItem[];
}

export const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const date = payload[0].payload.date;
  const income = payload[0].value;
  const expense = payload.length > 1 && payload[1] ? payload[1].value : 0;

  return (
    <div className="overflow-hidden rounded-sm border bg-white shadow-sm">
      <div className="bg-muted text-muted-foreground p-2 px-3 text-sm">
        {format(date, "MMM dd, yyyy")}
      </div>
      <Separator />
      <div className="space-y-1 p-2 px-3">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-teal-500" />
            <p className="text-muted-foreground text-sm">Income</p>
          </div>
          <p className="text-right text-sm">{formatCurrency(income)}</p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-rose-500" />
            <p className="text-muted-foreground text-sm">Expenses</p>
          </div>
          <p className="text-right text-sm">{formatCurrency(expense * -1)}</p>
        </div>
      </div>
    </div>
  );
};
