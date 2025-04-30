import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";

/**
 * Inferred type of the successful HTTP 200 response returned by the Plaid link token API endpoint.
 */
type ResponseType = InferResponseType<(typeof client.api.plaid)["create-link-token"]["$post"], 200>;

/**
 * A custom hook that creates a mutation to fetch a temporary Plaid link token from the backend.
 * @returns A mutation object containing methods to execute the request and monitor its lifecycle states.
 */
export const useCreateLinkToken = () => {
  const mutation = useMutation<ResponseType, Error>({
    // Executes an asynchronous POST request to generate a new initialization token package.
    mutationFn: async () => {
      const response = await client.api.plaid["create-link-token"].$post();

      // Throws an exception immediately if the server responds with an invalid status code.
      if (!response.ok) {
        throw Error("Failed to create link token");
      }

      return await response.json();
    },
    // Triggers an automated confirmation toast notification when the handshake token is generated.
    onSuccess: () => {
      toast.success("Link token created");
    },
    // Triggers an automated error toast notification if the token generation fails.
    onError: () => {
      toast.error("Failed to create link token");
    },
  });

  return mutation;
};
