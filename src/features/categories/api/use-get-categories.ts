import { createGetList } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to fetch the collection of budget category records.
 */
export const useGetCategories = createGetList(client.api.categories, {
  // Configures the static array key used to locate and identify the data collection within the cache layer.
  queryKey: ["categories"],
  // Custom exception text message triggered automatically if the network request fails.
  error: "Failed to fetch categories",
});
