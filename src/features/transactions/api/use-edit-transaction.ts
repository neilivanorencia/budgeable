import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<(typeof client.api.transactions)[":id"]["$patch"]>;
type RequestType = InferRequestType<(typeof client.api.transactions)[":id"]["$patch"]>["json"];

export const useEditTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, { id: string; data: RequestType }>({
    mutationFn: async ({ id, data }) => {
      const response = await client.api.transactions[":id"]["$patch"]({
        param: { id },
        json: data,
      });

      return await response.json();
    },
    onSuccess: (_, { id }) => {
      toast.success("Transaction edited");
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to edit transaction");
    },
  });

  return mutation;
};
