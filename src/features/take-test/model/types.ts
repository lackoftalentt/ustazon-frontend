export interface Answer {
    id: number;
    text: string;
    order: number;
}

export interface Question {
    id: number;
    text: string;
    photo: string | null;
    video: string | null;
    order: number;
    answers: Answer[];
    // correctAnswer is only set after test submission when results are returned
    correctAnswer?: number;
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

export interface TestState {
    questions: Question[];
    currentQuestionIndex: number;
    answers: (number | null)[];
    timeLimit: number;
    startTime: number | null;
    endTime: number | null;
    isTestStarted: boolean;
    isTestCompleted: boolean;
    submitResult: TestSubmitResult | null;
    isSubmitting: boolean;
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
    setSubmitResult: (result: TestSubmitResult) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
}

export type TestStore = TestState & TestActions;
