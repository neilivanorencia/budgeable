import { createGetList } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to fetch the collection of financial account records.
 */
export const useGetAccounts = createGetList(client.api.accounts, {
  // Configures the static array key used to locate and identify the data collection within the cache layer.
  queryKey: ["accounts"],
  // Custom exception text message triggered automatically if the network request fails.
  error: "Failed to fetch accounts",
});
