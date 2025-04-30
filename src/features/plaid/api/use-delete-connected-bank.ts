import { InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Inferred type of the successful HTTP 200 response returned by the Plaid bank deletion API endpoint.
 */
type ResponseType = InferResponseType<(typeof client.api.plaid)["connected-bank"]["$delete"], 200>;

/**
 * A custom hook that removes the linked bank credentials and resets associated financial caches.
 * @returns A mutation object containing methods to execute the request and monitor its lifecycle states.
 */
export const useDeleteConnectedBank = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    // Executes an asynchronous DELETE request to sever the active bank credentials token sync.
    mutationFn: async () => {
      const response = await client.api.plaid["connected-bank"].$delete();

      // Throws an exception immediately if the server responds with an error code.
      if (!response.ok) {
        throw new Error("Failed to delete connected bank");
      }

      return await response.json();
    },
    // Triggers automated feedback notifications and a complete reset of financial caches.
    onSuccess: () => {
      toast.success("Connected bank deleted");

      // Forces a stale state across all matching storage keys to guarantee interface structural data alignment.
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["connected-bank"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    // Triggers an automated error toast notification if the network operation fails.
    onError: () => {
      toast.error("Failed to delete connected bank");
    },
  });

  return mutation;
};
