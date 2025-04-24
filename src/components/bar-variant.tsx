import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { CustomTooltip } from "@/components/custom-tooltip";

type Props = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export const BarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, "dd MMM")}
          tickMargin={16}
          style={{ fontSize: "12px" }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(20,184,166,0.05)" }} />
        <Bar dataKey="income" fill="#14b8a6" radius={[8, 8, 0, 0]} className="drop-shadow-sm" />
        <Bar dataKey="expenses" fill="#ec4899" radius={[8, 8, 0, 0]} className="drop-shadow-sm" />
      </BarChart>
    </ResponsiveContainer>
  );
};
