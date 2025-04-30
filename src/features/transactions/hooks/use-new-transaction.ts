import { createToggleStore } from "@/lib/create-store";

/**
 * A global state hook managing the visibility tracking of the new transaction creation sheet.
 */
export const useNewTransaction = createToggleStore();
