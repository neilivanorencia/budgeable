import { create } from "zustand";

type ToggleState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

type OpenState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const createToggleStore = () =>
  create<ToggleState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  }));

export const createOpenStore = () =>
  create<OpenState>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined }),
  }));
