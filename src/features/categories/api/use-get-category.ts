import { createGetOne } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useGetCategory = createGetOne(client.api.categories[":id"], {
  queryKey: "category",
  error: "Failed to fetch category",
});
