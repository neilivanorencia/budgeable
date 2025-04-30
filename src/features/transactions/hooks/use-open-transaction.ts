import { createOpenStore } from "@/lib/create-store";

/**
 * A global state hook managing the visibility and tracking state of the transaction sheet.
 */
export const useOpenTransaction = createOpenStore();
