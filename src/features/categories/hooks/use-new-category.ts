import { createToggleStore } from "@/lib/create-store";

/**
 * A global state hook managing the visibility tracking of the new category creation sheet.
 */
export const useNewCategory = createToggleStore();
