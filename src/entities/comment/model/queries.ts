import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from '@tanstack/react-query';
import {
    fetchComments,
    createComment,
    deleteComment,
    updateComment
} from '../api';
import type { CreateCommentDto } from './types';

export const commentKeys = {
    all: ['comments'] as const,
    list: (lessonId: string) => [...commentKeys.all, 'list', lessonId] as const
};

// Хук для получения комментариев с пагинацией
export const useCommentsQuery = (lessonId: string, pageSize = 20) => {
    return useQuery({
        queryKey: commentKeys.list(lessonId),
        queryFn: () => fetchComments({ lessonId, page: 1, pageSize }),
        enabled: !!lessonId,
        staleTime: 30 * 1000 // 30 секунд
    });
};

// Хук для бесконечной загрузки комментариев
export const useCommentsInfiniteQuery = (lessonId: string, pageSize = 20) => {
    return useInfiniteQuery({
        queryKey: [...commentKeys.list(lessonId), 'infinite'],
        queryFn: ({ pageParam = 1 }) =>
            fetchComments({ lessonId, page: pageParam, pageSize }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.length * pageSize;
            return totalLoaded < lastPage.total ? allPages.length + 1 : undefined;
        },
        enabled: !!lessonId
    });
};

// Хук для создания комментария
export const useCreateCommentMutation = (lessonId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateCommentDto) => createComment(dto),
        onSuccess: newComment => {
            // Оптимистичное обновление - добавляем комментарий в начало списка
            queryClient.setQueryData(
                commentKeys.list(lessonId),
                (oldData: { items: typeof newComment[]; total: number } | undefined) => {
                    if (!oldData) return { items: [newComment], total: 1, page: 1, pageSize: 20 };
                    return {
                        ...oldData,
                        items: [newComment, ...oldData.items],
                        total: oldData.total + 1
                    };
                }
            );
        }
    });
};

// Хук для удаления комментария
export const useDeleteCommentMutation = (lessonId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: string) => deleteComment(commentId),
        onSuccess: (_, commentId) => {
            queryClient.setQueryData(
                commentKeys.list(lessonId),
                (oldData: { items: { id: string }[]; total: number } | undefined) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        items: oldData.items.filter(c => c.id !== commentId),
                        total: oldData.total - 1
                    };
                }
            );
        }
    });
};

// Хук для редактирования комментария
export const useUpdateCommentMutation = (lessonId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
            updateComment(commentId, text),
        onSuccess: updatedComment => {
            queryClient.setQueryData(
                commentKeys.list(lessonId),
                (oldData: { items: typeof updatedComment[] } | undefined) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        items: oldData.items.map(c =>
                            c.id === updatedComment.id ? updatedComment : c
                        )
                    };
                }
            );
        }
    });
};
