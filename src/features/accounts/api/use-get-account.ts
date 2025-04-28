import { createGetOne } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useGetAccount = createGetOne(client.api.accounts[":id"], {
  queryKey: "account",
  error: "Failed to fetch account",
});
