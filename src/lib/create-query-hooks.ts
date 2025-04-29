import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Fallback baseline signature mapping RPC client function methods.
 */
type EndpointFn = (...args: never[]) => Promise<unknown>;

// Type inference extractors targeting embedded JSON bodies, properties, and structural database data vectors.
type JsonOf<T> = T extends { json: infer J } ? J : never;
type DataOf<T> = T extends { data: infer D } ? D : never;
type JsonResponse<R> = { ok: boolean; json: () => Promise<R> };

/**
 * Context configuration objects framing operational notification messages.
 */
type Messages = { success: string; error: string };

/**
 * Generates an automated query engine hook configuration specialized in processing remote plural resource lists.
 */
export function createGetList<E extends { $get: EndpointFn }>(
  endpoint: E,
  config: { queryKey: QueryKey; error: string }
) {
  type Data = DataOf<InferResponseType<E["$get"], 200>>;

  return () =>
    useQuery<Data, Error>({
      queryKey: config.queryKey,
      queryFn: async () => {
        const get = endpoint.$get as () => Promise<JsonResponse<{ data: Data }>>;
        const response = await get();

        if (!response.ok) {
          throw new Error(config.error);
        }

        const { data } = await response.json();

        return data;
      },
    });
}

/**
 * Generates an automated conditional query hook instance configured to read distinct item records by string identifier.
 */
export function createGetOne<
  E extends { $get: EndpointFn },
  R = DataOf<InferResponseType<E["$get"], 200>>,
>(
  endpoint: E,
  config: {
    queryKey: string;
    error: string;
    transform?: (data: DataOf<InferResponseType<E["$get"], 200>>) => R;
  }
) {
  type Data = DataOf<InferResponseType<E["$get"], 200>>;

  return (id?: string) =>
    useQuery<R, Error>({
      // Defers downstream fetch execution pipelines until an evaluation identifier string is available.
      enabled: !!id,
      queryKey: [config.queryKey, { id }],
      queryFn: async () => {
        const get = endpoint.$get as (arg: {
          param: { id?: string };
        }) => Promise<JsonResponse<{ data: Data }>>;
        const response = await get({ param: { id } });

        if (!response.ok) {
          throw new Error(config.error);
        }

        const { data } = await response.json();

        return config.transform ? config.transform(data) : (data as unknown as R);
      },
    });
}

/**
 * Factory module generating custom mutations that post new records to remote data backends.
 */
export function createPostMutation<E extends { $post: EndpointFn }>(
  endpoint: E,
  config: { invalidate: QueryKey[]; messages: Messages }
) {
  type Response = InferResponseType<E["$post"]>;
  type Request = JsonOf<InferRequestType<E["$post"]>>;

  return () => {
    const queryClient = useQueryClient();

    return useMutation<Response, Error, Request>({
      mutationFn: async (json) => {
        const post = endpoint.$post as (arg: { json: Request }) => Promise<JsonResponse<Response>>;
        const response = await post({ json });

        return response.json();
      },
      onSuccess: () => {
        // Fires success banner notifications and resets matching validation cache structures.
        toast.success(config.messages.success);
        config.invalidate.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
      },
      onError: () => {
        toast.error(config.messages.error);
      },
    });
  };
}

/**
 * Factory module creating mutation wrappers that apply patch update payloads to targeted remote entity structures.
 */
export function createEditMutation<E extends { $patch: EndpointFn }>(
  endpoint: E,
  config: { singleKey: string; invalidate: QueryKey[]; messages: Messages }
) {
  type Response = InferResponseType<E["$patch"]>;
  type Request = JsonOf<InferRequestType<E["$patch"]>>;

  return () => {
    const queryClient = useQueryClient();

    return useMutation<Response, Error, { id: string; data: Request }>({
      mutationFn: async ({ id, data }) => {
        const patch = endpoint.$patch as (arg: {
          param: { id: string };
          json: Request;
        }) => Promise<JsonResponse<Response>>;
        const response = await patch({ param: { id }, json: data });

        return response.json();
      },
      onSuccess: (_, { id }) => {
        // Refreshes the distinct detailed object cache along with parent collections on successful updates.
        toast.success(config.messages.success);
        queryClient.invalidateQueries({ queryKey: [config.singleKey, { id }] });
        config.invalidate.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
      },
      onError: () => {
        toast.error(config.messages.error);
      },
    });
  };
}

/**
 * Factory module engineering a mutation blueprint used to execute deletion operations over item ids.
 */
export function createDeleteMutation<E extends { $delete: EndpointFn }>(
  endpoint: E,
  config: { singleKey: string; invalidate: QueryKey[]; messages: Messages }
) {
  type Response = InferResponseType<E["$delete"]>;

  return (id?: string) => {
    const queryClient = useQueryClient();

    return useMutation<Response, Error>({
      mutationFn: async () => {
        const del = endpoint.$delete as (arg: {
          param: { id?: string };
        }) => Promise<JsonResponse<Response>>;
        const response = await del({ param: { id } });

        return response.json();
      },
      onSuccess: () => {
        // Resets local tracking caches immediately following validated remote database table deletions.
        toast.success(config.messages.success);
        queryClient.invalidateQueries({ queryKey: [config.singleKey, { id }] });
        config.invalidate.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
      },
      onError: () => {
        toast.error(config.messages.error);
      },
    });
  };
}
