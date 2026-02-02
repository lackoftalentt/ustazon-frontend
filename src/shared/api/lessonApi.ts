import { apiClient } from './apiClient';

export interface LessonResponse {
    id: number;
    content: LessonDocument;
}

export interface LessonDocument {
    meta: {
        title: string;
        subject: string;
        grade: string;
        topic: string;
        language: string;
        created_at: string;
    };
    layout: {
        page_size: 'A4';
        font: 'serif' | 'sans';
        show_name_field: boolean;
        show_date_field: boolean;
    };
    blocks: LessonBlock[];
}

export type LessonBlock =
    | HeadingBlock
    | TheoryBlock
    | ImageBlock
    | VocabularyBlock
    | TestBlock
    | OpenQuestionBlock;

export interface HeadingBlock {
    type: 'heading';
    level: number;
    text: string;
}

export interface TheoryBlock {
    type: 'theory';
    sections: { title: string; content: string }[];
}

export interface ImageBlock {
    type: 'image';
    url: string;
    caption: string;
}

export interface VocabularyBlock {
    type: 'vocabulary';
    items: { term: string; definition: string }[];
}

export interface TestBlock {
    type: 'test';
    test_id: number;
}

export interface OpenQuestionBlock {
    type: 'open_question';
    question: string;
}

export interface UserLesson {
    id: number;
    title: string;
    subject: string;
    grade: string;
    topic: string;
    material_type: string;
    file_url: string | null;
    created_at: string;
}

export const lessonApi = {
    getUserLessons: async (): Promise<UserLesson[]> => {
        const response = await apiClient.get<UserLesson[]>(
            '/teaching-materials/my',
            { params: { material_type: 'lesson' } },
        );
        return response.data;
    },

    generateLesson: async (
        subject: string,
        grade: string,
        topic: string,
        language: string = 'kk',
        questionCount: number = 10,
        difficulty: string = 'medium',
    ): Promise<LessonResponse> => {
        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('grade', grade);
        formData.append('topic', topic);
        formData.append('language', language);
        formData.append('question_count', questionCount.toString());
        formData.append('difficulty', difficulty);

        const response = await apiClient.post<LessonResponse>(
            '/lessons/generate',
            formData,
            {
                timeout: 120000,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
        return response.data;
    },

    getLessonById: async (lessonId: number): Promise<LessonResponse> => {
        const response = await apiClient.get<LessonResponse>(
            `/lessons/${lessonId}`,
        );
        return response.data;
    },
};
