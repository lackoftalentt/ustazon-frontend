import { apiClient } from '@/shared/api/apiClient';
import type { LessonDetail, LessonProgress } from '../model/types';

// GET /lessons/{id} - получение детальной информации об уроке
export const fetchLesson = async (lessonId: string): Promise<LessonDetail> => {
    const response = await apiClient.get<LessonDetail>(`/lessons/${lessonId}`);
    return response.data;
};

// GET /lessons/{id}/progress - получение прогресса по уроку
export const fetchLessonProgress = async (
    lessonId: string
): Promise<LessonProgress> => {
    const response = await apiClient.get<LessonProgress>(
        `/lessons/${lessonId}/progress`
    );
    return response.data;
};

// PATCH /lessons/{id}/progress - обновление прогресса по уроку
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

// POST /lessons/{id}/complete - отметить урок как завершенный
export const completeLesson = async (
    lessonId: string
): Promise<LessonProgress> => {
    const response = await apiClient.post<LessonProgress>(
        `/lessons/${lessonId}/complete`
    );
    return response.data;
};
