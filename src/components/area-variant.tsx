import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { CustomTooltip } from "@/components/custom-tooltip";

/**
 * Properties containing historical cash flow data.
 */
type Props = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

/**
 * Renders a data chart visualization showing income versus expenses over time using gradient area fills.
 */
export const AreaVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        {/* Renders structural background grid lines with an alternate gray color split */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

        {/* Defines color gradient configurations used to fill the area shapes */}
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#14b8a6" stopOpacity={0.85} />
            <stop offset="98%" stopColor="#14b8a6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#f43f5e" stopOpacity={0.85} />
            <stop offset="98%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>

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

        {/* Displays the financial data curves layered directly inside the dashboard viewport view */}
        <Area
          type="monotone"
          dataKey="income"
          stackId="income"
          strokeWidth={2}
          stroke="#14b8a6"
          fill="url(#income)"
          className="drop-shadow-sm"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stackId="expenses"
          strokeWidth={2}
          stroke="#ec4899"
          fill="url(#expenses)"
          className="drop-shadow-sm"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
