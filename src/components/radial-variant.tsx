import { Legend, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

import { useCurrency } from "@/features/settings/hooks/use-currency";
import { convertAmountFromMiliunits } from "@/lib/utils";

/**
 * Fallback palette of hex color strings used to paint individual chart concentric tracks.
 */
const COLORS = [
  "#14b8a6",
  "#6366f1",
  "#3b82f6",
  "#22c55e",
  "#ec4899",
  "#0ea5e9",
  "#a855f7",
  "#8b5cf6",
  "#ef4444",
  "#84cc16",
  "#06b6d4",
  "#d946ef",
];

/**
 * Properties containing structural category metrics.
 */
type Props = {
  data?: {
    name: string;
    value: number;
    color?: string | null;
  }[];
};

/**
 * Renders a categorical data chart visualization formatted into a layered radial bar layout.
 */
export const RadialVariant = ({ data }: Props) => {
  // Extracts currency formatting handlers configured to match active user localization.
  const { format } = useCurrency();

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadialBarChart
        cx="50%"
        cy="40%"
        barSize={10}
        innerRadius="90%"
        outerRadius="40%"
        data={data?.map((item, index) => ({
          ...item,
          fill: item.color ?? COLORS[index % COLORS.length],
        }))}
      >
        {/* Core dynamic bar track rendering values alongside embedded inline string labels */}
        <RadialBar
          label={{
            fill: "#fff",
            fontSize: 12,
            position: "insideStart",
            formatter: (value: number) => format(convertAmountFromMiliunits(value)),
          }}
          background
          dataKey="value"
        />

        {/* Displays descriptive category trackers paired with their formatted financial magnitudes */}
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          content={(props) => {
            const payload = props.payload ?? [];
            return (
              <ul className="flex flex-row flex-wrap justify-center gap-x-3 gap-y-1.5 pt-2">
                {payload.map((entry, index) => (
                  <li key={`item-${index}`} className="flex items-center gap-1.5">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-muted-foreground text-xs">{entry.value}</span>
                    <span className="text-xs font-medium">
                      {format(convertAmountFromMiliunits(entry.payload?.value ?? 0))}
                    </span>
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};
