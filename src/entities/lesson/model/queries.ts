import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchLesson,
    fetchLessonProgress,
    updateLessonProgress,
    completeLesson
} from '../api';

export const lessonKeys = {
    all: ['lessons'] as const,
    detail: (id: string) => [...lessonKeys.all, 'detail', id] as const,
    progress: (id: string) => [...lessonKeys.all, 'progress', id] as const
};

// Хук для получения детальной информации об уроке
export const useLessonQuery = (lessonId: string) => {
    return useQuery({
        queryKey: lessonKeys.detail(lessonId),
        queryFn: () => fetchLesson(lessonId),
        enabled: !!lessonId,
        staleTime: 5 * 60 * 1000 // 5 минут
    });
};

// Хук для получения прогресса по уроку
export const useLessonProgressQuery = (lessonId: string) => {
    return useQuery({
        queryKey: lessonKeys.progress(lessonId),
        queryFn: () => fetchLessonProgress(lessonId),
        enabled: !!lessonId,
        staleTime: 30 * 1000 // 30 секунд
    });
};

// Хук для обновления прогресса (мутация)
export const useUpdateProgressMutation = (lessonId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { watchedSeconds: number; isCompleted?: boolean }) =>
            updateLessonProgress(lessonId, data),
        onSuccess: data => {
            queryClient.setQueryData(lessonKeys.progress(lessonId), data);
        }
    });
};

// Хук для завершения урока (мутация)
export const useCompleteLessonMutation = (lessonId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => completeLesson(lessonId),
        onSuccess: data => {
            queryClient.setQueryData(lessonKeys.progress(lessonId), data);
            // Инвалидируем связанные данные курса
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        }
    });
};
