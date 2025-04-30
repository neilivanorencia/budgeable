import { createPostMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to execute standard singular transaction creation requests.
 */
export const useCreateTransaction = createPostMutation(client.api.transactions, {
  // Lists query keys that must be marked stale to trigger fresh background network requests.
  invalidate: [["transactions"], ["summary"]],
  // Custom user-facing feedback messages rendered dynamically via toast notification wrappers.
  messages: { success: "Transaction created", error: "Failed to create transaction" },
});
