import { apiClient } from '@shared/api/apiClient';

export type TestDifficulty = 'easy' | 'medium' | 'hard';

export interface Test {
    id: number;
    title: string;
    subject: string;
    duration: number;
    difficulty: TestDifficulty;
    user_id: number;
    questions_count: number;
    created_at: string;
    updated_at: string;
}

export interface TestFilters {
    skip?: number;
    limit?: number;
    subject?: string;
    difficulty?: TestDifficulty;
    author_id?: number;
}

export interface TestAnswer {
    id: number;
    text: string;
    order: number;
}

export interface TestQuestion {
    id: number;
    text: string;
    photo: string | null;
    video: string | null;
    order: number;
    answers: TestAnswer[];
}

export interface TestToTake {
    id: number;
    title: string;
    subject: string;
    duration: number;
    difficulty: string;
    questions_count: number;
    questions: TestQuestion[];
}

export interface SubmitAnswerPayload {
    question_id: number;
    answer_id: number;
}

export interface SubmitTestPayload {
    test_id: number;
    answers: SubmitAnswerPayload[];
}

export interface QuestionResult {
    question_id: number;
    question_text: string;
    answers: {
        id: number;
        text: string;
        is_correct: boolean;
    }[];
    selected_answer_id: number | null;
    correct_answer_id: number;
    is_correct: boolean;
}

export interface TestSubmitResult {
    test_id: number;
    total_questions: number;
    correct_answers: number;
    score_percentage: number;
    passed: boolean;
    questions_results?: QuestionResult[];
}

export const testApi = {
    async getTests(params?: TestFilters): Promise<Test[]> {
        const response = await apiClient.get<Test[]>('/tests/', { params });
        return response.data;
    },

    async getTestById(id: number): Promise<Test> {
        const response = await apiClient.get<Test>(`/tests/${id}`);
        return response.data;
    },

    async getTestToTake(testId: number): Promise<TestToTake> {
        const response = await apiClient.get<TestToTake>(`/tests/${testId}/take`);
        return response.data;
    },

    async submitTest(testId: number, answers: SubmitAnswerPayload[]): Promise<TestSubmitResult> {
        const payload: SubmitTestPayload = {
            test_id: testId,
            answers
        };
        const response = await apiClient.post<TestSubmitResult>(`/tests/${testId}/submit`, payload);
        return response.data;
    }
};
