import { apiClient } from '@/shared/api/apiClient';
import type { Comment, CreateCommentDto } from '../model/types';

interface CommentsResponse {
    items: Comment[];
    total: number;
    page: number;
    pageSize: number;
}

interface FetchCommentsParams {
    lessonId: string;
    page?: number;
    pageSize?: number;
}

// GET /lessons/{lessonId}/comments - получение комментариев к уроку
export const fetchComments = async ({
    lessonId,
    page = 1,
    pageSize = 20
}: FetchCommentsParams): Promise<CommentsResponse> => {
    const response = await apiClient.get<CommentsResponse>(
        `/lessons/${lessonId}/comments`,
        {
            params: { page, page_size: pageSize }
        }
    );
    return response.data;
};

// POST /lessons/{lessonId}/comments - создание комментария
export const createComment = async (
    dto: CreateCommentDto
): Promise<Comment> => {
    const response = await apiClient.post<Comment>(
        `/lessons/${dto.lessonId}/comments`,
        { text: dto.text }
    );
    return response.data;
};

// DELETE /comments/{id} - удаление комментария
export const deleteComment = async (commentId: string): Promise<void> => {
    await apiClient.delete(`/comments/${commentId}`);
};

// PATCH /comments/{id} - редактирование комментария
export const updateComment = async (
    commentId: string,
    text: string
): Promise<Comment> => {
    const response = await apiClient.patch<Comment>(`/comments/${commentId}`, {
        text
    });
    return response.data;
};
