import { createPostMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useBulkDeleteTransactions = createPostMutation(
  client.api.transactions["bulk-delete"],
  {
    invalidate: [["transactions"], ["summary"]],
    messages: { success: "Transactions deleted", error: "Failed to delete transactions" },
  }
);
