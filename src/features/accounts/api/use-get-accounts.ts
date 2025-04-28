import { createGetList } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useGetAccounts = createGetList(client.api.accounts, {
  queryKey: ["accounts"],
  error: "Failed to fetch accounts",
});
