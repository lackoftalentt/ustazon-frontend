import { apiClient } from './apiClient';

export interface QMJLessonInfo {
    subject: string;
    topic: string;
    grade: string;
    duration: number;
    learning_objectives: string[];
    lesson_objectives: string[];
    assessment_criteria: string[];
    values: string;
    cross_curricular_links: string;
    prior_knowledge: string;
    resources: string[];
}

export interface QMJStage {
    name: string;
    name_ru: string;
    duration: number;
    teacher_activities: string;
    student_activities: string;
    assessment: string;
    resources: string;
}

export interface QMJDifferentiation {
    support: string;
    extension: string;
    assessment_of_learning: string;
}

export interface QMJReflection {
    questions: string[];
}

export interface QMJHomework {
    description: string;
    differentiated: boolean;
    tasks: string[];
}

export interface QMJContent {
    meta: {
        title: string;
        subject: string;
        grade: string;
        topic: string;
        language: string;
        created_at: string;
    };
    lesson_info: QMJLessonInfo;
    stages: QMJStage[];
    differentiation: QMJDifferentiation;
    reflection: QMJReflection;
    homework: QMJHomework;
}

export interface QMJResponse {
    id: number;
    content: QMJContent;
}

export interface UserQMJ {
    id: number;
    title: string;
    subject: string;
    grade: string;
    topic: string;
    material_type: string;
    file_url: string | null;
    created_at: string;
}

export const qmjAiApi = {
    generateQMJ: async (
        subject: string,
        grade: string,
        topic: string,
        language: string = 'kk',
    ): Promise<QMJResponse> => {
        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('grade', grade);
        formData.append('topic', topic);
        formData.append('language', language);

        const response = await apiClient.post<QMJResponse>(
            '/qmj/generate',
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

    getQMJById: async (id: number): Promise<QMJResponse> => {
        const response = await apiClient.get<QMJResponse>(`/qmj/ai/${id}`);
        return response.data;
    },

    getUserQMJs: async (): Promise<UserQMJ[]> => {
        const response = await apiClient.get<UserQMJ[]>(
            '/teaching-materials/my',
            { params: { material_type: 'qmj' } },
        );
        return response.data;
    },
};
