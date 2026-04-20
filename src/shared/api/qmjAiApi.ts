import { apiClient } from './apiClient';

export interface QMJValuesEducation {
    value_name: string;
    value_description: string;
    value_sentences: string[];
}

export interface QMJLessonInfo {
    subject: string;
    topic: string;
    grade: string;
    section?: string;
    duration: number;
    learning_objectives: string[];
    lesson_objectives: string[];
    assessment_criteria: string[];
    values_education?: QMJValuesEducation;
    /** @deprecated Use values_education instead */
    values?: string;
    cross_curricular_links: string;
    prior_knowledge: string;
    resources: string[];
}

export interface QMJExercise {
    number: string;
    text: string;
    work_type?: string;
    descriptors: string[];
    assessment_method: string;
    resources?: string;
}

export interface QMJStage {
    name: string;
    name_ru: string;
    duration: number;
    work_type?: string;
    method?: string;
    teacher_activities?: string;
    student_activities?: string;
    assessment?: string;
    resources?: string;
    exercises?: QMJExercise[];
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
    exercise_number?: string;
    differentiated?: boolean;
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
