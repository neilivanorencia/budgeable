import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

/**
 * A custom hook that fetches a collection of transaction records from the database.
 * @returns A query object containing the transformed transaction records, loading states, and errors.
 */
export const useGetTransactions = () => {
  // Extracts active search filtering parameters from the current routing location URL.
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    // Includes dynamic filter parameters in the query key for unique caching instances per filter state.
    queryKey: ["transactions", { from, to, accountId }],
    // Performs the network request to load transactions based on the extracted URL criteria parameters.
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId,
        },
      });

      // Checks for HTTP transport errors or non-2xx server response codes to reject the query promise.
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const { data } = await response.json();

      // Maps over the transaction items to convert database currency integers into standard float denominations.
      return data.map((transaction) => ({
        ...transaction,
        amount: convertAmountFromMiliunits(transaction.amount),
      }));
    },
  });

  return query;
};
