import { createPostMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useBulkDeleteCategories = createPostMutation(client.api.categories["bulk-delete"], {
  invalidate: [["categories"], ["summary"]],
  messages: { success: "Categories deleted", error: "Failed to delete categories" },
});
