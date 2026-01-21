import { create } from 'zustand';
import type { KMJData } from './types';

interface EditKMJModalState {
    isOpen: boolean;
    kmjData: KMJData | null;
    openModal: (data: KMJData) => void;
    closeModal: () => void;
}

export const useEditKMJStore = create<EditKMJModalState>((set) => ({
    isOpen: false,
    kmjData: null,

    openModal: (data: KMJData) => set({ isOpen: true, kmjData: data }),

    closeModal: () => set({ isOpen: false, kmjData: null })
}));
