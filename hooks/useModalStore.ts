import { ModalStore } from "@/lib/types";
import { create } from "zustand";

const useModalStore = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) =>
    set({
      isOpen: true,
      type: type,
      data: data,
    }),
  onClose: () => set({ type: null, isOpen: false }),
}));

export { useModalStore };
