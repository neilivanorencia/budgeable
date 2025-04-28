import { createEditMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useEditTransaction = createEditMutation(client.api.transactions[":id"], {
  singleKey: "transaction",
  invalidate: [["transactions"], ["summary"]],
  messages: { success: "Transaction edited", error: "Failed to edit transaction" },
});
