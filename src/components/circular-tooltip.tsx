import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

type CircularTooltipProps = {
  active?: boolean;
  payload?: {
    payload: {
      name: string;
    };
    value: number;
  }[];
};

export const CircularTooltip = ({ active, payload }: CircularTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const name = payload[0].payload.name;
  const value = payload[0].value;

  return (
    <div className="overflow-hidden rounded-sm border bg-white shadow-sm">
      <div className="bg-muted text-muted-foreground p-2 px-3 text-sm">{name}</div>
      <Separator />
      <div className="space-y-1 p-2 px-3">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-rose-500" />
            <p className="text-muted-foreground text-sm">Expenses</p>
          </div>
          <p className="text-right text-sm">{formatCurrency(value * -1)}</p>
        </div>
      </div>
    </div>
  );
};
