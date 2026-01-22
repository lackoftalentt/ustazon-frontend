export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_OPTIONS: { value: DifficultyLevel; label: string }[] = [
    { value: 'easy', label: 'Оңай' },
    { value: 'medium', label: 'Орташа' },
    { value: 'hard', label: 'Қиын' }
];

export interface EditAnswer {
    id: number;
    localId: string;
    text: string;
    isCorrect: boolean;
    order: number;
}

export interface EditQuestion {
    id: number;
    localId: string;
    text: string;
    photo?: string;
    newImage?: File;
    order: number;
    answers: EditAnswer[];
}

export interface TestData {
    id: number;
    title: string;
    subject: string;
    duration: number;
    difficulty: DifficultyLevel;
    questionsCount: number;
}

export interface FullTestData {
    id: number;
    title: string;
    subject: string;
    duration: number;
    difficulty: DifficultyLevel;
    questions: EditQuestion[];
}

export interface EditTestFormData {
    title: string;
    subject: string;
    duration: number;
    difficulty: DifficultyLevel;
    questions: EditQuestion[];
}

export const MIN_DURATION = 1;
export const MAX_DURATION = 180;

export const createDefaultAnswer = (localId: string, order: number): EditAnswer => ({
    id: 0,
    localId,
    text: '',
    isCorrect: false,
    order
});

export const createDefaultQuestion = (localId: string, order: number): EditQuestion => ({
    id: 0,
    localId,
    text: '',
    order,
    answers: [
        createDefaultAnswer(`${localId}-1`, 0),
        createDefaultAnswer(`${localId}-2`, 1),
        createDefaultAnswer(`${localId}-3`, 2),
        createDefaultAnswer(`${localId}-4`, 3),
        createDefaultAnswer(`${localId}-5`, 4)
    ]
});
