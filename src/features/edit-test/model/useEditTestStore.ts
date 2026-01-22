import { create } from 'zustand';
import type { TestData, FullTestData, EditQuestion, DifficultyLevel } from './types';
import { testApi, type QuestionResponse } from '@/shared/api/testApi';

interface EditTestStore {
    isOpen: boolean;
    testData: TestData | null;
    fullTestData: FullTestData | null;
    isLoadingFullData: boolean;
    openModal: (data: TestData) => void;
    closeModal: () => void;
    loadFullTestData: (testId: number) => Promise<void>;
    setFullTestData: (data: FullTestData | null) => void;
}

const mapQuestionResponse = (question: QuestionResponse, index: number): EditQuestion => ({
    id: question.id,
    localId: `q-${question.id}`,
    text: question.text,
    photo: question.photo,
    order: question.order ?? index,
    answers: question.answers.map((answer, aIndex) => ({
        id: answer.id,
        localId: `a-${answer.id}`,
        text: answer.text,
        isCorrect: answer.is_correct,
        order: answer.order ?? aIndex
    }))
});

export const useEditTestStore = create<EditTestStore>((set, get) => ({
    isOpen: false,
    testData: null,
    fullTestData: null,
    isLoadingFullData: false,

    openModal: (data: TestData) => {
        set({ isOpen: true, testData: data, fullTestData: null });
        get().loadFullTestData(data.id);
    },

    closeModal: () => set({
        isOpen: false,
        testData: null,
        fullTestData: null,
        isLoadingFullData: false
    }),

    loadFullTestData: async (testId: number) => {
        set({ isLoadingFullData: true });
        try {
            const response = await testApi.getTestById(testId);
            const fullData: FullTestData = {
                id: response.id,
                title: response.title,
                subject: response.subject,
                duration: response.duration,
                difficulty: response.difficulty as DifficultyLevel,
                questions: response.questions.map(mapQuestionResponse)
            };
            set({ fullTestData: fullData, isLoadingFullData: false });
        } catch (error) {
            console.error('Failed to load full test data:', error);
            set({ isLoadingFullData: false });
        }
    },

    setFullTestData: (data: FullTestData | null) => set({ fullTestData: data })
}));
