import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { CircularTooltip } from "@/components/circular-tooltip";
import { formatPercentage } from "@/lib/utils";

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

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

export const PieVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
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
                      {formatPercentage(((entry.payload as { percent?: number })?.percent ?? 0) * 100)}
                    </span>
                  </li>
                ))}
              </ul>
            );
          }}
        />
        <Tooltip content={<CircularTooltip />} />
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
          {data?.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
