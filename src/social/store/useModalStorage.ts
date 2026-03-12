import { create } from "zustand";
interface ModalStorage {
  showModal: boolean;
  setShowModal: () => void;
}
export const useModalStorage = create<ModalStorage>()((set) => ({
  showModal: false,
  setShowModal: () => set((state) => ({ showModal: !state.showModal })),
}));
