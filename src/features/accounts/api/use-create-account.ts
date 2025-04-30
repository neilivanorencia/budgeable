import { createPostMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

/**
 * A custom hook generated to execute singular financial account creation requests.
 */
export const useCreateAccount = createPostMutation(client.api.accounts, {
  // Lists query keys that must be marked stale to trigger fresh background network requests.
  invalidate: [["accounts"]],
  // Custom user-facing feedback messages rendered dynamically via toast notification wrappers.
  messages: { success: "Account created", error: "Failed to create account." },
});
