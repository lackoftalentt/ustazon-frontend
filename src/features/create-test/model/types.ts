export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_LEVELS: { value: DifficultyLevel; label: string; description: string }[] = [
    { value: 'easy', label: 'Оңай', description: 'Барлық сұрақтар бір бетте. Кез келген сұраққа оралуға болады.' },
    { value: 'medium', label: 'Орташа', description: 'Бір уақытта бір сұрақ. Алға және артқа жылжу мүмкіндігі бар.' },
    { value: 'hard', label: 'Қиын', description: 'Тек жауап берген жағдайда ғана келесі сұраққа өтуге болады. Артқа қайту жоқ.' }
];

export interface Answer {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    text: string;
    image?: File;
    answers: Answer[];
}

export interface CreateTestFormData {
    subjectCode: string;
    name: string;
    duration: number;
    difficulty: DifficultyLevel;
    questions: Question[];
}

export const DEFAULT_ANSWERS: Answer[] = [
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: false },
    { id: '3', text: '', isCorrect: false },
    { id: '4', text: '', isCorrect: false },
    { id: '5', text: '', isCorrect: false }
];

export const createDefaultQuestion = (id: string): Question => ({
    id,
    text: '',
    answers: DEFAULT_ANSWERS.map((a, i) => ({ ...a, id: `${id}-${i + 1}` }))
});

export const MIN_DURATION = 5;
export const MAX_DURATION = 180;
export const MIN_QUESTIONS = 1;
export const MAX_QUESTIONS = 50;
export const MIN_ANSWERS = 2;
export const MAX_ANSWERS = 5;
