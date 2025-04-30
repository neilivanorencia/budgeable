import { createGetOne } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

/**
 * A custom hook generated to fetch a single transaction record by its unique identifier.
 */
export const useGetTransaction = createGetOne(client.api.transactions[":id"], {
  // The query key fragment applied to target or clear this specific query cache context.
  queryKey: "transaction",
  // The fall-back user notification message rendered if the fetch request fails.
  error: "Failed to fetch transaction",
  // Modifies the raw server payload structure prior to making it accessible to interface components.
  transform: (data) => ({
    ...data,
    // Converts the database ledger amounts stored in miliunits back into primary currency units.
    amount: convertAmountFromMiliunits(data.amount),
  }),
});
