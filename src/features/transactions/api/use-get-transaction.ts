import { createGetOne } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetTransaction = createGetOne(client.api.transactions[":id"], {
  queryKey: "transaction",
  error: "Failed to fetch transaction",
  transform: (data) => ({
    ...data,
    amount: convertAmountFromMiliunits(data.amount),
  }),
});
