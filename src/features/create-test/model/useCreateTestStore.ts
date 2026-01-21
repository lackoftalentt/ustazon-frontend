import { create } from 'zustand';

interface CreateTestStore {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const useCreateTestStore = create<CreateTestStore>(set => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false })
}));
