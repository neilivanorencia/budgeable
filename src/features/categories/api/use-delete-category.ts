import { createDeleteMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to delete a specific budget category record by its unique identifier.
 */
export const useDeleteCategory = createDeleteMutation(client.api.categories[":id"], {
  // Specifies the individual query cache identifier string to target precise item lookups.
  singleKey: "category",
  // Lists query keys that must be marked stale to trigger fresh background network requests.
  invalidate: [["categories"], ["transactions"], ["summary"]],
  // Custom user-facing feedback messages rendered dynamically via toast notification wrappers.
  messages: { success: "Category deleted", error: "Failed to delete category" },
});
