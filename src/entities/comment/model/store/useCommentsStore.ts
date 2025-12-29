import { create } from 'zustand';
import type { Comment, CreateCommentDto } from '../types';

interface CommentsState {
    comments: Comment[];
    isLoading: boolean;
    error: string | null;

    fetchComments: (lessonId: string) => Promise<void>;
    addComment: (dto: CreateCommentDto) => Promise<void>;
    clearComments: () => void;
}

const mockComments: Comment[] = [
    {
        id: '1',
        authorName: 'Алексей',
        authorInitial: 'А',
        text: 'Отличный урок! Всё понятно объяснено, особенно понравилась часть про практические примеры.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        lessonId: '1'
    },
    {
        id: '2',
        authorName: 'Мария',
        authorInitial: 'М',
        text: 'Спасибо за материал! Можно ли добавить больше примеров решения задач?',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        lessonId: '1'
    },
    {
        id: '3',
        authorName: 'Дмитрий',
        authorInitial: 'Д',
        text: 'Хороший урок, но хотелось бы видеть больше визуальных схем.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        lessonId: '1'
    }
];

export const useCommentsStore = create<CommentsState>((set, get) => ({
    comments: [],
    isLoading: false,
    error: null,

    fetchComments: async (lessonId: string) => {
        set({ isLoading: true, error: null });

        try {
            // TODO: заменить на реальный API вызов
            await new Promise(resolve => setTimeout(resolve, 500));

            const filteredComments = mockComments.filter(
                c => c.lessonId === lessonId
            );
            set({ comments: filteredComments, isLoading: false });
        } catch {
            set({ error: 'Не удалось загрузить комментарии', isLoading: false });
        }
    },

    addComment: async (dto: CreateCommentDto) => {
        set({ isLoading: true, error: null });

        try {
            // TODO: заменить на реальный API вызов
            await new Promise(resolve => setTimeout(resolve, 300));

            const newComment: Comment = {
                id: Date.now().toString(),
                authorName: 'Вы',
                authorInitial: 'В',
                text: dto.text,
                createdAt: new Date(),
                lessonId: dto.lessonId
            };

            set(state => ({
                comments: [newComment, ...state.comments],
                isLoading: false
            }));
        } catch {
            set({ error: 'Не удалось отправить комментарий', isLoading: false });
        }
    },

    clearComments: () => {
        set({ comments: [], error: null });
    }
}));
