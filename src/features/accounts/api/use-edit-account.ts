import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<(typeof client.api.accounts)[":id"]["$patch"]>;
type RequestType = InferRequestType<(typeof client.api.accounts)[":id"]["$patch"]>["json"];

export const useEditAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, { id: string; data: RequestType }>({
    mutationFn: async ({ id, data }) => {
      const response = await client.api.accounts[":id"]["$patch"]({
        param: { id },
        json: data,
      });

      return await response.json();
    },
    onSuccess: (_, { id }) => {
      toast.success("Account edited");
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      toast.error("Failed to edit account");
    },
  });

  return mutation;
};
