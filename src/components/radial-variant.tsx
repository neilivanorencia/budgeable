/* eslint-disable @typescript-eslint/no-explicit-any */
import { Legend, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

const COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];

type Props = {
  data?: {
    name: string;
    value: number;
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
          fill: COLORS[index % COLORS.length],
        }))}
      >
        <RadialBar
          label={{
            fill: "#fff",
            fontSize: 12,
            position: "insideStart",
            formatter: (value: number) => Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value / 1000)
          }}
          background
          dataKey="value"
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          content={({ payload }: any) => {
            return (
              <ul className="flex flex-row flex-wrap justify-center gap-2">
                {payload.map((entry: any, index: number) => (
                  <li key={`item-${index}`} className="flex items-center space-x-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <div className="space-x-1">
                      <span className="text-muted-foreground text-sm">{entry.value}</span>
                      <span className="text-sm">
                        {Intl.NumberFormat("en-PH", {
                          style: "currency",
                          currency: "PHP",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(entry.payload.value / 1000)}
                      </span>
                    </div>
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
