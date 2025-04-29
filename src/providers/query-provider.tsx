"use client";

import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Factory function configured to instantiate a fresh, isolated TanStack QueryClient instances.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Enforces a global server data freshness timeline marker threshold of 60 seconds.
        staleTime: 60 * 1000,
      },
    },
  });
}

// Global runtime memory pointer tracking the singleton instance inside client viewports.
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Structural execution arbiter that guarantees safe instance singleton segregation
 * across Server-Side Rendering (SSR) environments and hydration runtimes.
 */
function getQueryClient() {
  if (isServer) {
    // Server execution frames always construct fresh isolated client nodes per request.
    return makeQueryClient();
  } else {
    // Browser runtimes lazily create and reuse a persistent client context state registry.
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

/**
 * Top-level React context wrapper that encapsulates application layout boundaries
 * with structural caching pipelines and request deduplication capabilities.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Mounts the context manager bound strictly to the target environment's query client pointer.
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
