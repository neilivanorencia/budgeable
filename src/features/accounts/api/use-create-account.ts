import { createPostMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useCreateAccount = createPostMutation(client.api.accounts, {
  invalidate: [["accounts"]],
  messages: { success: "Account created", error: "Failed to create account." },
});
