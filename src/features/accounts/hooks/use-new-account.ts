import { createToggleStore } from "@/lib/create-store";

/**
 * A global state hook managing the visibility tracking of the new account creation sheet.
 */
export const useNewAccount = createToggleStore();
