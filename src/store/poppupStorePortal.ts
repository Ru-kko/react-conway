import { create, StoreApi, UseBoundStore } from "zustand";

interface PopupStore {
  message: string | null;
  messageDuration: number;
  dismiss: () => void;
  showMessage: (message: string, duration?: number) => void;
}

export const usePopupStore = create<PopupStore>((set, get) => ({
  message: null,
  messageDuration: 3000,
  dismiss: () => {
    set({ message: null });
  },
  showMessage: (message: string, duration: number = 3000) => {
    set({ message, messageDuration: duration });
  },
}));
