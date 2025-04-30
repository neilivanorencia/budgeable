import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Inferred type of the successful response returned by the bulk-create transactions API endpoint.
 */
type ResponseType = InferResponseType<(typeof client.api.transactions)["bulk-create"]["$post"]>;

/**
 * Inferred type of the JSON payload required by the bulk-create transactions API endpoint.
 */
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];

/**
 * A custom hook that wraps a TanStack Query mutation for bulk creating transaction records.
 * @returns A mutation object containing methods to trigger the request and track its lifecycle state.
 */
export const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Executes the asynchronous POST request to transmit the batch transaction payload via the Hono client.
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-create"].$post({ json });

      return await response.json();
    },
    // Triggers automated side effects upon a successful batch creation sequence.
    onSuccess: () => {
      toast.success("Transactions created");

      // Invalidates the active query caches to force a fresh background refetch of updated financial data.
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    // Triggers automated side effects if the network request or processing encounters an error.
    onError: () => {
      toast.error("Failed to create transactions");
    },
  });

  return mutation;
};
