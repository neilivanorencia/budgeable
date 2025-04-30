import { createPostMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to execute singular budget category creation requests.
 */
export const useCreateCategory = createPostMutation(client.api.categories, {
  // Lists query keys that must be marked stale to trigger fresh background network requests.
  invalidate: [["categories"]],
  // Custom user-facing feedback messages rendered dynamically via toast notification wrappers.
  messages: { success: "Category created", error: "Failed to create category" },
});
