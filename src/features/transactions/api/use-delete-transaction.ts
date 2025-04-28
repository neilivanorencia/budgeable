import { createDeleteMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useDeleteTransaction = createDeleteMutation(client.api.transactions[":id"], {
  singleKey: "transaction",
  invalidate: [["transactions"], ["summary"]],
  messages: { success: "Transaction deleted", error: "Failed to delete transaction" },
});
