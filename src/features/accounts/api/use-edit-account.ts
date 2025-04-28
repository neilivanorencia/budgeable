import { createEditMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useEditAccount = createEditMutation(client.api.accounts[":id"], {
  singleKey: "account",
  invalidate: [["accounts"], ["transactions"], ["summary"]],
  messages: { success: "Account edited", error: "Failed to edit account" },
});
