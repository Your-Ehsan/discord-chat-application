import { Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "invite";

type ModalData = {
  server?: Server | null;
};

type ModalStore = {
  data: ModalData;
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type: type, data: data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
