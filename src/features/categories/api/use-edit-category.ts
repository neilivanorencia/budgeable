import { createEditMutation } from "@/lib/create-query-hooks";
import { client } from "@/lib/hono";

export const useEditCategory = createEditMutation(client.api.categories[":id"], {
  singleKey: "category",
  invalidate: [["categories"], ["transactions"], ["summary"]],
  messages: { success: "Category edited", error: "Failed to edit category" },
});
