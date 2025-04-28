import { createDeleteMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useDeleteCategory = createDeleteMutation(client.api.categories[":id"], {
  singleKey: "category",
  invalidate: [["categories"], ["transactions"], ["summary"]],
  messages: { success: "Category deleted", error: "Failed to delete category" },
});
