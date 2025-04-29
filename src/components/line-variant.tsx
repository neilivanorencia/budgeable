import { format } from "date-fns";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

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
 * Renders a data chart visualization showing income versus expenses using interconnected data lines.
 */
export const LineVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "#14b8a6", strokeWidth: 1, strokeDasharray: "4 4" }}
        />

        {/* Displays the comparative flow trends inside the linear path framework layout */}
        <Line
          dot={false}
          dataKey="income"
          stroke="#14b8a6"
          strokeWidth={2}
          className="drop-shadow-sm"
        />
        <Line
          dot={false}
          dataKey="expenses"
          stroke="#ec4899"
          strokeWidth={2}
          className="drop-shadow-sm"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
