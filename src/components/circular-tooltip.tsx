import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/features/settings/hooks/use-currency";
import { convertAmountFromMiliunits } from "@/lib/utils";

/**
 * Structural property definitions for the customized circular chart hover overlay component.
 */
type CircularTooltipProps = {
  active?: boolean;
  payload?: {
    payload: {
      name: string;
    };
    value: number;
  }[];
};

/**
 * A customized tooltip popover component designed to format category items on data chart hover states.
 */
export const CircularTooltip = ({ active, payload }: CircularTooltipProps) => {
  // Extracts currency formatting handlers tailored to match active user localization options.
  const { format } = useCurrency();

  // Evaluates internal status parameters to safeguard against null values during rendering cycles.
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // Deconstructs the primary label strings and active values from the data payload frame.
  const name = payload[0].payload.name;
  const value = payload[0].value;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_10px_15px_-3px_rgba(30,25,20,0.05),0_4px_6px_-4px_rgba(30,25,20,0.05)] md:border-2">
      {/* Category descriptive header showing the currently targeted data key */}
      <div className="bg-teal-50/80 p-2 px-3 text-sm text-teal-700">{name}</div>
      <Separator />

      {/* Visual content container translating raw values back into active financial strings */}
      <div className="space-y-1 p-2 px-3">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 rounded-full bg-rose-500" />
            <p className="text-muted-foreground text-sm">Expenses</p>
          </div>
          <p className="text-right text-sm">{format(convertAmountFromMiliunits(value) * -1)}</p>
        </div>
      </div>
    </div>
  );
};
