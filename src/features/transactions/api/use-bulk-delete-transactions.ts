import { createPostMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to execute batch transaction deletion requests.
 */
export const useBulkDeleteTransactions = createPostMutation(
  client.api.transactions["bulk-delete"],
  {
    // Lists query keys that must be marked stale to trigger fresh background network requests.
    invalidate: [["transactions"], ["summary"]],
    // Custom user-facing feedback messages rendered dynamically via toast notification wrappers.
    messages: { success: "Transactions deleted", error: "Failed to delete transactions" },
  }
);
