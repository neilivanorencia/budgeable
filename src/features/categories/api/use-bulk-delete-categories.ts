import { createPostMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to execute batch budget category deletion requests.
 */
export const useBulkDeleteCategories = createPostMutation(client.api.categories["bulk-delete"], {
  // Lists query keys that must be marked stale to trigger fresh background network requests.
  invalidate: [["categories"], ["summary"]],
  // Custom user-facing feedback messages rendered dynamically via toast notification wrappers.
  messages: { success: "Categories deleted", error: "Failed to delete categories" },
});
