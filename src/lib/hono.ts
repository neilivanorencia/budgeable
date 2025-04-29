import { hc } from "hono/client";

import { AppType } from "@/app/api/[[...route]]/route";

/**
 * Global, strongly-typed RPC client instance configured for backend API interaction.
 */
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
