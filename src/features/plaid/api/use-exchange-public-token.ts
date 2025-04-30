import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";

/**
 * Inferred type of the successful HTTP 200 response returned by the Plaid token exchange API endpoint.
 */
type ResponseType = InferResponseType<
  (typeof client.api.plaid)["exchange-public-token"]["$post"],
  200
>;

/**
 * Inferred type of the JSON payload containing the public token string required by the API endpoint.
 */
type RequestType = InferRequestType<
  (typeof client.api.plaid)["exchange-public-token"]["$post"]
>["json"];

/**
 * A custom hook that exchanges a temporary Plaid public token for secure permanent bank credentials.
 * @returns A mutation object containing methods to execute the request and monitor its lifecycle states.
 */
export const useExchangePublicToken = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Submits the public token payload data package to the backend server routes.
    mutationFn: async (json) => {
      const response = await client.api.plaid["exchange-public-token"].$post({ json });

      // Errors out immediately if the server responds with an invalid status code.
      if (!response.ok) {
        throw new Error("Failed to exchange public token");
      }

      return await response.json();
    },
    // Triggers feedback notifications and a refresh of financial data models upon a successful handshake.
    onSuccess: () => {
      toast.success("Public token exchanged");

      // Forces a stale state across all matching storage keys to guarantee UI structural data alignment.
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["connected-bank"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    // Triggers an automated error toast notification if the network operation fails.
    onError: () => {
      toast.error("Failed to exchange public token");
    },
  });

  return mutation;
};
