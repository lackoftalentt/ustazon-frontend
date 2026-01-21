import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question, TestStore, TestSubmitResult } from './types';

const DEFAULT_TIME_LIMIT = 300;
const STORAGE_KEY = 'test-progress';

export const useTestStore = create<TestStore>()(
    persist(
        (set, get) => ({
            questions: [],
            currentQuestionIndex: 0,
            answers: [],
            timeLimit: DEFAULT_TIME_LIMIT,
            startTime: null,
            endTime: null,
            isTestStarted: false,
            isTestCompleted: false,
            submitResult: null,
            isSubmitting: false,

            startTest: (questions: Question[], timeLimit = DEFAULT_TIME_LIMIT) => {
                set({
                    questions,
                    currentQuestionIndex: 0,
                    answers: new Array(questions.length).fill(null),
                    timeLimit,
                    startTime: Date.now(),
                    endTime: null,
                    isTestStarted: true,
                    isTestCompleted: false
                });
            },

            selectAnswer: (questionIndex: number, answerIndex: number) => {
                const { answers, isTestCompleted } = get();
                if (isTestCompleted) return;

                const newAnswers = [...answers];
                newAnswers[questionIndex] = answerIndex;
                set({ answers: newAnswers });
            },

            nextQuestion: () => {
                const { currentQuestionIndex, questions } = get();
                if (currentQuestionIndex < questions.length - 1) {
                    set({ currentQuestionIndex: currentQuestionIndex + 1 });
                }
            },

            previousQuestion: () => {
                const { currentQuestionIndex } = get();
                if (currentQuestionIndex > 0) {
                    set({ currentQuestionIndex: currentQuestionIndex - 1 });
                }
            },

            goToQuestion: (index: number) => {
                const { questions } = get();
                if (index >= 0 && index < questions.length) {
                    set({ currentQuestionIndex: index });
                }
            },

            finishTest: () => {
                const { isTestCompleted } = get();
                if (isTestCompleted) return;

                set({
                    endTime: Date.now(),
                    isTestCompleted: true
                });
            },

            resetTest: () => {
                set({
                    questions: [],
                    currentQuestionIndex: 0,
                    answers: [],
                    timeLimit: DEFAULT_TIME_LIMIT,
                    startTime: null,
                    endTime: null,
                    isTestStarted: false,
                    isTestCompleted: false,
                    submitResult: null,
                    isSubmitting: false
                });
            },

            setSubmitResult: (result: TestSubmitResult) => {
                set({ submitResult: result });
            },

            setIsSubmitting: (isSubmitting: boolean) => {
                set({ isSubmitting });
            },

            getScore: () => {
                const { questions, answers } = get();
                return questions.reduce((score, question, index) => {
                    return score + (answers[index] === question.correctAnswer ? 1 : 0);
                }, 0);
            },

            getElapsedTime: () => {
                const { startTime, endTime, isTestCompleted } = get();
                if (!startTime) return 0;

                const end = isTestCompleted && endTime ? endTime : Date.now();
                return Math.floor((end - startTime) / 1000);
            },

            isQuestionAnswered: (index: number) => {
                const { answers } = get();
                return answers[index] !== null;
            }
        }),
        {
            name: STORAGE_KEY,
            partialize: state => ({
                questions: state.questions,
                currentQuestionIndex: state.currentQuestionIndex,
                answers: state.answers,
                timeLimit: state.timeLimit,
                startTime: state.startTime,
                endTime: state.endTime,
                isTestStarted: state.isTestStarted,
                isTestCompleted: state.isTestCompleted,
                submitResult: state.submitResult
            })
        }
    )
);
