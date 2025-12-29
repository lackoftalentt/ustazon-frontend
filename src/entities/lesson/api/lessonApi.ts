import { apiClient } from '@/shared/api/apiClient';
import type { LessonDetail, LessonProgress } from '../model/types';

export const fetchLesson = async (lessonId: string): Promise<LessonDetail> => {
    const response = await apiClient.get<LessonDetail>(`/lessons/${lessonId}`);
    return response.data;
};

export const fetchLessonProgress = async (
    lessonId: string
): Promise<LessonProgress> => {
    const response = await apiClient.get<LessonProgress>(
        `/lessons/${lessonId}/progress`
    );
    return response.data;
};

export const updateLessonProgress = async (
    lessonId: string,
    data: { watchedSeconds: number; isCompleted?: boolean }
): Promise<LessonProgress> => {
    const response = await apiClient.patch<LessonProgress>(
        `/lessons/${lessonId}/progress`,
        data
    );
    return response.data;
};

export const completeLesson = async (
    lessonId: string
): Promise<LessonProgress> => {
    const response = await apiClient.post<LessonProgress>(
        `/lessons/${lessonId}/complete`
    );
    return response.data;
};
