import { create } from "zustand";

/**
 * State contract for simple on/off interface toggles like creation sheets.
 */
type ToggleState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

/**
 * State contract for entity-bound interfaces like resource editing sheets that require an identifier.
 */
type OpenState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

/**
 * Factory that instantiates an isolated global state store for simple modal visibility tracking.
 */
export const createToggleStore = () =>
  create<ToggleState>((set) => ({
    // Shared state tracking drawer display visibility flags
    isOpen: false,

    // Explicit visibility modifiers controlling view presentation states
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  }));

/**
 * Factory that instantiates an isolated global state store for tracking targeted entity view overlays.
 */
export const createOpenStore = () =>
  create<OpenState>((set) => ({
    // Tracks the current record context parameter pointer target
    id: undefined,
    isOpen: false,

    // Updates internal visibility flags and mounts the selected item context tracking ID
    onOpen: (id: string) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined }),
  }));
