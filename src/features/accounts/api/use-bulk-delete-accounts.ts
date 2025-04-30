import { createPostMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to execute batch financial account deletion requests.
 */
export const useBulkDeleteAccounts = createPostMutation(client.api.accounts["bulk-delete"], {
  // Lists query keys that must be marked stale to trigger fresh background network requests.
  invalidate: [["accounts"]],
  // Custom user-facing feedback messages rendered dynamically via toast notification wrappers.
  messages: { success: "Accounts deleted", error: "Failed to delete accounts." },
});
