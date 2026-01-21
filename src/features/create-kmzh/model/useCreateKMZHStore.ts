import { create } from 'zustand';

interface CreateKMZHModalState {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const useCreateKMZHStore = create<CreateKMZHModalState>(set => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false })
}));
