import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.settings.$patch>;
type RequestType = InferRequestType<typeof client.api.settings.$patch>["json"];

export const useUpdateCurrency = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.settings.$patch({ json });

      if (!response.ok) {
        throw new Error("Failed to update currency");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Currency updated");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to update currency");
    },
  });

  return mutation;
};
