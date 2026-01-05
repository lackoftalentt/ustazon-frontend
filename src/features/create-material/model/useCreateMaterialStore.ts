import { create } from 'zustand';

interface CreateMaterialModalState {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const useCreateMaterialStore = create<CreateMaterialModalState>(set => ({
    isOpen: true,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false })
}));
