import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { editTestSchema, type EditTestSchema } from './validation';
import type { FullTestData, EditTestFormData, EditQuestion, DifficultyLevel } from './types';
import { createDefaultQuestion, createDefaultAnswer, MIN_DURATION, MAX_DURATION } from './types';

let questionIdCounter = 1000;

export const useEditTestForm = (
    fullTestData: FullTestData | null,
    onSubmit: (data: EditTestFormData) => Promise<void>
) => {
    const [questions, setQuestions] = useState<EditQuestion[]>([]);

    const form = useForm<EditTestSchema>({
        resolver: zodResolver(editTestSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            title: '',
            subject: '',
            duration: 30,
            difficulty: 'medium',
            questions: []
        }
    });

    const { handleSubmit, setValue, reset, formState } = form;

    useEffect(() => {
        if (fullTestData) {
            const mappedQuestions = fullTestData.questions.length > 0
                ? fullTestData.questions
                : [createDefaultQuestion('new-1', 0)];

            setQuestions(mappedQuestions);
            reset({
                title: fullTestData.title,
                subject: fullTestData.subject,
                duration: fullTestData.duration,
                difficulty: fullTestData.difficulty,
                questions: mappedQuestions
            });
        }
    }, [fullTestData, reset]);

    const handleDurationChange = useCallback(
        (value: number) => {
            const clamped = Math.min(MAX_DURATION, Math.max(MIN_DURATION, value));
            setValue('duration', clamped, {
                shouldValidate: formState.isSubmitted
            });
        },
        [setValue, formState.isSubmitted]
    );

    const handleDifficultyChange = useCallback(
        (value: DifficultyLevel) => {
            setValue('difficulty', value, { shouldValidate: true });
        },
        [setValue]
    );

    const addQuestion = useCallback(() => {
        const newId = `new-${++questionIdCounter}`;
        const newQuestion = createDefaultQuestion(newId, questions.length);
        const updatedQuestions = [...questions, newQuestion];
        setQuestions(updatedQuestions);
        setValue('questions', updatedQuestions, { shouldValidate: true });
    }, [questions, setValue]);

    const removeQuestion = useCallback(
        (index: number) => {
            if (questions.length <= 1) return;
            const updatedQuestions = questions
                .filter((_, i) => i !== index)
                .map((q, i) => ({ ...q, order: i }));
            setQuestions(updatedQuestions);
            setValue('questions', updatedQuestions, { shouldValidate: true });
        },
        [questions, setValue]
    );

    const updateQuestionText = useCallback(
        (index: number, text: string) => {
            const updatedQuestions = [...questions];
            updatedQuestions[index] = { ...updatedQuestions[index], text };
            setQuestions(updatedQuestions);
            setValue('questions', updatedQuestions, { shouldValidate: true });
        },
        [questions, setValue]
    );

    const updateQuestionImage = useCallback(
        (index: number, file: File | undefined) => {
            const updatedQuestions = [...questions];
            updatedQuestions[index] = {
                ...updatedQuestions[index],
                newImage: file,
                photo: file ? undefined : updatedQuestions[index].photo
            };
            setQuestions(updatedQuestions);
            setValue('questions', updatedQuestions, { shouldValidate: true });
        },
        [questions, setValue]
    );

    const removeQuestionImage = useCallback(
        (index: number) => {
            const updatedQuestions = [...questions];
            updatedQuestions[index] = {
                ...updatedQuestions[index],
                newImage: undefined,
                photo: undefined
            };
            setQuestions(updatedQuestions);
            setValue('questions', updatedQuestions, { shouldValidate: true });
        },
        [questions, setValue]
    );

    const updateAnswerText = useCallback(
        (questionIndex: number, answerIndex: number, text: string) => {
            const updatedQuestions = [...questions];
            const updatedAnswers = [...updatedQuestions[questionIndex].answers];
            updatedAnswers[answerIndex] = { ...updatedAnswers[answerIndex], text };
            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                answers: updatedAnswers
            };
            setQuestions(updatedQuestions);
            setValue('questions', updatedQuestions, { shouldValidate: true });
        },
        [questions, setValue]
    );

    const setCorrectAnswer = useCallback(
        (questionIndex: number, answerIndex: number) => {
            const updatedQuestions = [...questions];
            const updatedAnswers = updatedQuestions[questionIndex].answers.map(
                (answer, i) => ({
                    ...answer,
                    isCorrect: i === answerIndex
                })
            );
            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                answers: updatedAnswers
            };
            setQuestions(updatedQuestions);
            setValue('questions', updatedQuestions, { shouldValidate: true });
        },
        [questions, setValue]
    );

    const addAnswer = useCallback(
        (questionIndex: number) => {
            const updatedQuestions = [...questions];
            const currentAnswers = updatedQuestions[questionIndex].answers;
            if (currentAnswers.length >= 6) return;

            const newAnswerId = `new-answer-${++questionIdCounter}`;
            const newAnswer = createDefaultAnswer(newAnswerId, currentAnswers.length);
            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                answers: [...currentAnswers, newAnswer]
            };
            setQuestions(updatedQuestions);
            setValue('questions', updatedQuestions, { shouldValidate: true });
        },
        [questions, setValue]
    );

    const removeAnswer = useCallback(
        (questionIndex: number, answerIndex: number) => {
            const updatedQuestions = [...questions];
            const currentAnswers = updatedQuestions[questionIndex].answers;
            if (currentAnswers.length <= 2) return;

            const updatedAnswers = currentAnswers
                .filter((_, i) => i !== answerIndex)
                .map((a, i) => ({ ...a, order: i }));
            updatedQuestions[questionIndex] = {
                ...updatedQuestions[questionIndex],
                answers: updatedAnswers
            };
            setQuestions(updatedQuestions);
            setValue('questions', updatedQuestions, { shouldValidate: true });
        },
        [questions, setValue]
    );

    const resetForm = useCallback(() => {
        setQuestions([]);
        reset();
    }, [reset]);

    const submitForm = handleSubmit(async (data: EditTestSchema) => {
        const formData: EditTestFormData = {
            title: data.title,
            subject: data.subject,
            duration: data.duration,
            difficulty: data.difficulty,
            questions: questions
        };
        await onSubmit(formData);
    });

    return {
        ...form,
        questions,
        handleDurationChange,
        handleDifficultyChange,
        addQuestion,
        removeQuestion,
        updateQuestionText,
        updateQuestionImage,
        removeQuestionImage,
        updateAnswerText,
        setCorrectAnswer,
        addAnswer,
        removeAnswer,
        resetForm,
        onSubmit: submitForm
    };
};
