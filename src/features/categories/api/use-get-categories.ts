import { createGetList } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useGetCategories = createGetList(client.api.categories, {
  queryKey: ["categories"],
  error: "Failed to fetch categories",
});
