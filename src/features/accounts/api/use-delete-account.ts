import { createDeleteMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useDeleteAccount = createDeleteMutation(client.api.accounts[":id"], {
  singleKey: "account",
  invalidate: [["accounts"], ["transactions"], ["summary"]],
  messages: { success: "Account deleted", error: "Failed to delete account" },
});
