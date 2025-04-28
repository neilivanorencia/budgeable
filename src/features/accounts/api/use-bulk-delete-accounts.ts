import { createPostMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useBulkDeleteAccounts = createPostMutation(client.api.accounts["bulk-delete"], {
  invalidate: [["accounts"]],
  messages: { success: "Accounts deleted", error: "Failed to delete accounts." },
});
