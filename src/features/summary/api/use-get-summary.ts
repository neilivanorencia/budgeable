import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches the financial dashboard summary overview data.
 * @returns A query object containing the aggregated and converted financial summary charts data.
 */
export const useGetSummary = () => {
  // Extracts active search filtering parameters from the current routing location URL.
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    // Includes dynamic filter parameters in the query key for unique caching instances per filter state.
    queryKey: ["summary", { from, to, accountId }],
    // Performs the network request to load dashboard statistics based on the extracted URL criteria parameters.
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
        },
      });

      // Checks for HTTP transport errors to reject the query promise.
      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const { data } = await response.json();

      // Formats the entire metrics payload by transforming database miliunits back into standard float values.
      return {
        ...data,
        incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
        expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
        remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
        // Maps over categorized breakdowns to fix the display values for charts.
        categories: data.categories.map((category) => ({
          ...category,
          amount: convertAmountFromMiliunits(category.value),
        })),
        // Maps over daily time-series records to normalize rendering values.
        days: data.days.map((day) => ({
          ...day,
          income: convertAmountFromMiliunits(day.income),
          expenses: convertAmountFromMiliunits(day.expenses),
        })),
      };
    },
  });

  return query;
};
