import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches the user`s configured preferred currency from their account settings.
 * @returns A query object containing the fetched currency string identifier.
 */
export const useGetCurrency = () => {
  const query = useQuery({
    // Stores the settings data under a static query key cache allocation.
    queryKey: ["settings"],
    // Performs the asynchronous GET request to pull down the configuration payload.
    queryFn: async () => {
      const response = await client.api.settings.$get();

      // Rejects the promise if the endpoint returns a non-2xx response code.
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const { data } = await response.json();

      return data.currency;
    },
  });

  return query;
};
