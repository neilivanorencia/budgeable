import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Inferred type of the successful response returned by the currency settings update API endpoint.
 */
type ResponseType = InferResponseType<typeof client.api.settings.$patch>;

/**
 * Inferred type of the JSON payload required by the currency settings update API endpoint.
 */
type RequestType = InferRequestType<typeof client.api.settings.$patch>["json"];

/**
 * Modifies the user`s preferred global currency setting configuration.
 * @returns A mutation object containing methods to execute the request and monitor its lifecycle states.
 */
export const useUpdateCurrency = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Submits the updated currency payload data package to the server back-end settings routes.
    mutationFn: async (json) => {
      const response = await client.api.settings.$patch({ json });

      // Errors out immediately if the server responds with a non-2xx status code.
      if (!response.ok) {
        throw new Error("Failed to update currency");
      }

      return await response.json();
    },
    // Triggers interface side effects and cache sweeping sequences upon a successful modification response.
    onSuccess: () => {
      toast.success("Currency updated");

      // Clears out all primary data stores so numerical items can be re-fetched and parsed in the new currency format.
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    // Triggers automated side effects if the network request or processing encounters an error.
    onError: () => {
      toast.error("Failed to update currency");
    },
  });

  return mutation;
};
