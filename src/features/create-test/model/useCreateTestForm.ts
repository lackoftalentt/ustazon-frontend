import { testApi, type CreateTestRequest } from '@/shared/api/testApi'
import { uploadApi } from '@/shared/api/uploadApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
	createDefaultQuestion,
	type CreateTestFormData,
	type DifficultyLevel,
	MAX_DURATION,
	MIN_DURATION,
	type Question
} from './types'
import { createTestSchema } from './validation'

export const useCreateTestForm = (
	onSubmitSuccess: () => Promise<void>
) => {
	const [questions, setQuestions] = useState<Question[]>([
		createDefaultQuestion('1')
	])

	const form = useForm<CreateTestFormData>({
		resolver: zodResolver(createTestSchema),
		defaultValues: {
			subjectCode: '',
			name: '',
			duration: 30,
			difficulty: 'medium',
			questions: [createDefaultQuestion('1')]
		}
	})

	const { handleSubmit, setValue, reset } = form

	const handleDurationChange = useCallback(
		(value: number) => {
			const clampedValue = Math.max(MIN_DURATION, Math.min(MAX_DURATION, value))
			setValue('duration', clampedValue, { shouldValidate: true })
		},
		[setValue]
	)

	const handleDifficultyChange = useCallback(
		(value: DifficultyLevel) => {
			setValue('difficulty', value, { shouldValidate: true })
		},
		[setValue]
	)

	const addQuestion = useCallback(() => {
		const newId = String(questions.length + 1)
		const newQuestion = createDefaultQuestion(newId)
		const updatedQuestions = [...questions, newQuestion]
		setQuestions(updatedQuestions)
		setValue('questions', updatedQuestions, { shouldValidate: true })
	}, [questions, setValue])

	const removeQuestion = useCallback(
		(index: number) => {
			if (questions.length <= 1) return
			const updatedQuestions = questions.filter((_, i) => i !== index)
			setQuestions(updatedQuestions)
			setValue('questions', updatedQuestions, { shouldValidate: true })
		},
		[questions, setValue]
	)

	const updateQuestionText = useCallback(
		(index: number, text: string) => {
			const updatedQuestions = [...questions]
			updatedQuestions[index] = { ...updatedQuestions[index], text }
			setQuestions(updatedQuestions)
			setValue('questions', updatedQuestions, { shouldValidate: true })
		},
		[questions, setValue]
	)

	const updateQuestionImage = useCallback(
		(index: number, file: File | undefined) => {
			const updatedQuestions = [...questions]
			updatedQuestions[index] = { ...updatedQuestions[index], image: file }
			setQuestions(updatedQuestions)
			setValue('questions', updatedQuestions, { shouldValidate: true })
		},
		[questions, setValue]
	)

	const updateAnswerText = useCallback(
		(questionIndex: number, answerIndex: number, text: string) => {
			const updatedQuestions = [...questions]
			const updatedAnswers = [...updatedQuestions[questionIndex].answers]
			updatedAnswers[answerIndex] = { ...updatedAnswers[answerIndex], text }
			updatedQuestions[questionIndex] = {
				...updatedQuestions[questionIndex],
				answers: updatedAnswers
			}
			setQuestions(updatedQuestions)
			setValue('questions', updatedQuestions, { shouldValidate: true })
		},
		[questions, setValue]
	)

	const setCorrectAnswer = useCallback(
		(questionIndex: number, answerIndex: number) => {
			const updatedQuestions = [...questions]
			const updatedAnswers = updatedQuestions[questionIndex].answers.map(
				(answer, i) => ({
					...answer,
					isCorrect: i === answerIndex
				})
			)
			updatedQuestions[questionIndex] = {
				...updatedQuestions[questionIndex],
				answers: updatedAnswers
			}
			setQuestions(updatedQuestions)
			setValue('questions', updatedQuestions, { shouldValidate: true })
		},
		[questions, setValue]
	)

	const resetForm = useCallback(() => {
		const defaultQuestion = createDefaultQuestion('1')
		setQuestions([defaultQuestion])
		reset({
			subjectCode: '',
			name: '',
			duration: 30,
			difficulty: 'medium',
			questions: [defaultQuestion]
		})
	}, [reset])

	const onSubmit = handleSubmit(async (data: CreateTestFormData) => {
		const questionsWithPhotos = await Promise.all(
			data.questions.map(async (question, index) => {
				let photoUrl: string | undefined

				if (question.image) {
					const uploadResult = await uploadApi.uploadImage(question.image)
					photoUrl = uploadResult.file_path
				}

				return {
					text: question.text,
					photo: photoUrl,
					order: index,
					answers: question.answers
						.filter(answer => answer.text.trim() !== '')
						.map((answer, answerIndex) => ({
							text: answer.text,
							is_correct: answer.isCorrect,
							order: answerIndex
						}))
				}
			})
		)

		const requestData: CreateTestRequest = {
			title: data.name,
			subject: data.subjectCode,
			duration: data.duration,
			difficulty: data.difficulty,
			questions: questionsWithPhotos
		}

		await testApi.createTest(requestData)
		await onSubmitSuccess()
	})

	return {
		...form,
		questions,
		handleDurationChange,
		handleDifficultyChange,
		addQuestion,
		removeQuestion,
		updateQuestionText,
		updateQuestionImage,
		updateAnswerText,
		setCorrectAnswer,
		resetForm,
		onSubmit
	}
}
