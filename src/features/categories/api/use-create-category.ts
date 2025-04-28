import { createPostMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useCreateCategory = createPostMutation(client.api.categories, {
  invalidate: [["categories"]],
  messages: { success: "Category created", error: "Failed to create category" },
});
