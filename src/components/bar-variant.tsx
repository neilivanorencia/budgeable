import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { CustomTooltip } from "@/components/custom-tooltip";

/**
 * Properties containing historical cash flow datasets.
 */
type Props = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

/**
 * Renders a data chart visualization showing income versus expenses using parallel vertical bars.
 */
export const BarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        {/* Renders structural background grid lines with an alternate gray color split */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

        {/* Configures the horizontal axis labels with standardized timestamp string styling templates */}
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, "dd MMM")}
          tickMargin={16}
          style={{ fontSize: "12px" }}
        />

        {/* Attaches a customized cursor tracker and tooltip overlay container onto active hover lines */}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(20,184,166,0.05)" }} />

        {/* Displays the comparative data rectangles side by side inside the graph canvas area */}
        <Bar dataKey="income" fill="#14b8a6" radius={[8, 8, 0, 0]} className="drop-shadow-sm" />
        <Bar dataKey="expenses" fill="#ec4899" radius={[8, 8, 0, 0]} className="drop-shadow-sm" />
      </BarChart>
    </ResponsiveContainer>
  );
};
