import { createEditMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to execute update mutations for a specific transaction record.
 */
export const useEditTransaction = createEditMutation(client.api.transactions[":id"], {
  // Specifies the individual query cache identifier string to target precise item lookups.
  singleKey: "transaction",
  // Lists query keys that must be marked stale to trigger fresh background network requests.
  invalidate: [["transactions"], ["summary"]],
  // Custom user-facing feedback messages rendered dynamically via toast notification wrappers.
  messages: { success: "Transaction edited", error: "Failed to edit transaction" },
});
