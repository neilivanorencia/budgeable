import { createGetOne } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to fetch a single budget category record by its unique identifier.
 */
export const useGetCategory = createGetOne(client.api.categories[":id"], {
  // Configures the cache namespace prefix for identifying individual record requests.
  queryKey: "category",
  // Custom exception text message triggered automatically if the network request fails.
  error: "Failed to fetch category",
});
