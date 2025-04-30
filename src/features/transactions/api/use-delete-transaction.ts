import { createDeleteMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to execute singular transaction deletion requests by record ID.
 */
export const useDeleteTransaction = createDeleteMutation(client.api.transactions[":id"], {
  // Specifies the individual query cache identifier string to target precise item lookups.
  singleKey: "transaction",
  // Lists query keys that must be marked stale to trigger fresh background network requests.
  invalidate: [["transactions"], ["summary"]],
  // Custom user-facing feedback messages rendered dynamically via toast notification wrappers.
  messages: { success: "Transaction deleted", error: "Failed to delete transaction" },
});
