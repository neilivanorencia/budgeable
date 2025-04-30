import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches the currently connected bank account linkage details.
 * @returns A query object containing the active bank credentials metadata or null if disconnected.
 */
export const useGetConnectedBank = () => {
  const query = useQuery({
    // Stores the connection information under a static query key cache allocation.
    queryKey: ["connected-bank"],
    // Performs the asynchronous GET request to load the integration status.
    queryFn: async () => {
      const response = await client.api.plaid["connected-bank"].$get();

      // Rejects the promise if the endpoint returns a non-2xx response code.
      if (!response.ok) {
        throw new Error("Failed to fetch connected bank");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
