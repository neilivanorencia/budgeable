import { createEditMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to execute update mutations for a specific budget category record.
 */
export const useEditCategory = createEditMutation(client.api.categories[":id"], {
  // Specifies the individual query cache identifier string to target precise item lookups.
  singleKey: "category",
  // Lists query keys that must be marked stale to trigger fresh background network requests.
  invalidate: [["categories"], ["transactions"], ["summary"]],
  // Custom user-facing feedback messages rendered dynamically via toast notification wrappers.
  messages: { success: "Category edited", error: "Failed to edit category" },
});
