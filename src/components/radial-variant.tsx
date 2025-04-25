import { Legend, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

import { convertAmountFromMiliunits, formatCurrency } from "@/lib/utils";

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
    color?: string | null;
  }[];
};

export const RadialVariant = ({ data }: Props) => {
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
        <RadialBar
          label={{
            fill: "#fff",
            fontSize: 12,
            position: "insideStart",
            formatter: (value: number) => formatCurrency(convertAmountFromMiliunits(value)),
          }}
          background
          dataKey="value"
        />
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
                      {formatCurrency(convertAmountFromMiliunits(entry.payload?.value ?? 0))}
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
