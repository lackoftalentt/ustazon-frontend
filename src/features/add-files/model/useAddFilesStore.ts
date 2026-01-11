import { create } from 'zustand';
import type { FileItem } from './types';

interface AddFilesModalState {
    isOpen: boolean;
    rowId: string | null;
    files: FileItem[];
    openModal: (rowId: string) => void;
    closeModal: () => void;
    addFiles: (files: FileItem[]) => void;
    removeFile: (id: string) => void;
    updateFileProgress: (id: string, progress: number) => void;
    updateFileStatus: (id: string, status: FileItem['status']) => void;
    clearFiles: () => void;
}

export const useAddFilesStore = create<AddFilesModalState>((set) => ({
    isOpen: false,
    rowId: null,
    files: [],

    openModal: (rowId: string) => set({ isOpen: true, rowId, files: [] }),

    closeModal: () => set({ isOpen: false, rowId: null, files: [] }),

    addFiles: (newFiles: FileItem[]) =>
        set((state) => ({
            files: [...state.files, ...newFiles]
        })),

    removeFile: (id: string) =>
        set((state) => ({
            files: state.files.filter((f) => f.id !== id)
        })),

    updateFileProgress: (id: string, progress: number) =>
        set((state) => ({
            files: state.files.map((f) =>
                f.id === id ? { ...f, progress } : f
            )
        })),

    updateFileStatus: (id: string, status: FileItem['status']) =>
        set((state) => ({
            files: state.files.map((f) =>
                f.id === id ? { ...f, status } : f
            )
        })),

    clearFiles: () => set({ files: [] })
}));
