import { createDeleteMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to delete a specific financial account record by its unique identifier.
 */
export const useDeleteAccount = createDeleteMutation(client.api.accounts[":id"], {
  // Specifies the individual query cache identifier string to target precise item lookups.
  singleKey: "account",
  // Lists query keys that must be marked stale to trigger fresh background network requests.
  invalidate: [["accounts"], ["transactions"], ["summary"]],
  // Custom user-facing feedback messages rendered dynamically via toast notification wrappers.
  messages: { success: "Account deleted", error: "Failed to delete account" },
});
