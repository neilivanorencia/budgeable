import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { CircularTooltip } from "@/components/circular-tooltip";
import { formatPercentage } from "@/lib/utils";

/**
 * Fallback palette of hex color strings used to paint individual donut chart slices.
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
 * Properties containing structural category value breakdowns.
 */
type Props = {
  data?: {
    name: string;
    value: number;
    color?: string | null;
  }[];
};

/**
 * Renders a categorical data chart visualization formatted into an accessorized donut pie layout.
 */
export const PieVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        {/* Render indicator elements showing color nodes alongside calculated distribution percentages */}
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
                      {formatPercentage(
                        ((entry.payload as { percent?: number })?.percent ?? 0) * 100
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            );
          }}
        />

        {/* Custom tooltip configuration that runs on mouse hover states over targeted pie nodes */}
        <Tooltip content={<CircularTooltip />} />

        {/* Core vector arc component parsing raw array items into physical chart shapes */}
        <Pie
          data={data}
          cx="50%"
          cy="42%"
          outerRadius={95}
          innerRadius={58}
          paddingAngle={3}
          cornerRadius={5}
          dataKey="value"
          labelLine={false}
          strokeWidth={2}
          stroke="white"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color ?? COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
