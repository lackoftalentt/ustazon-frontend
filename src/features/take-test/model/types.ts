export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface TestState {
    questions: Question[];
    currentQuestionIndex: number;
    answers: (number | null)[];
    timeLimit: number;
    startTime: number | null;
    endTime: number | null;
    isTestStarted: boolean;
    isTestCompleted: boolean;
}

export interface TestActions {
    startTest: (questions: Question[], timeLimit?: number) => void;
    selectAnswer: (questionIndex: number, answerIndex: number) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    goToQuestion: (index: number) => void;
    finishTest: () => void;
    resetTest: () => void;
    getScore: () => number;
    getElapsedTime: () => number;
    isQuestionAnswered: (index: number) => boolean;
}

export type TestStore = TestState & TestActions;
