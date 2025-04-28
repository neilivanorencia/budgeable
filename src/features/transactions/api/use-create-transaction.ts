import { createPostMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useCreateTransaction = createPostMutation(client.api.transactions, {
  invalidate: [["transactions"], ["summary"]],
  messages: { success: "Transaction created", error: "Failed to create transaction" },
});
