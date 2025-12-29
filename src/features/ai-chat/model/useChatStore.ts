import { create } from 'zustand';
import type { ChatMessage } from '../api/types';

interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;

    addUserMessage: (message: string, attachments?: ChatMessage['attachments']) => void;
    addAssistantMessage: (message: string) => void;
    setLoading: (loading: boolean) => void;
    clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(set => ({
    messages: [],
    isLoading: false,

    addUserMessage: (content, attachments) => {
        const message: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
            attachments
        };
        set(state => ({ messages: [...state.messages, message] }));
    },

    addAssistantMessage: content => {
        const message: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content
        };
        set(state => ({ messages: [...state.messages, message] }));
    },

    setLoading: isLoading => set({ isLoading }),

    clearMessages: () => set({ messages: [] })
}));
