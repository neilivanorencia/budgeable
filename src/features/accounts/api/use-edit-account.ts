import { createEditMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to execute update mutations for a specific financial account record.
 */
export const useEditAccount = createEditMutation(client.api.accounts[":id"], {
  // Specifies the individual query cache identifier string to target precise item lookups.
  singleKey: "account",
  // Lists query keys that must be marked stale to trigger fresh background network requests.
  invalidate: [["accounts"], ["transactions"], ["summary"]],
  // Custom user-facing feedback messages rendered dynamically via toast notification wrappers.
  messages: { success: "Account edited", error: "Failed to edit account" },
});
