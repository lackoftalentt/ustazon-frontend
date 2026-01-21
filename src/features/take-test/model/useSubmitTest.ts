import { useCallback } from 'react'
import { testApi, type SubmitAnswerPayload } from '@/entities/test'
import { useTestStore } from './useTestStore'

export const useSubmitTest = (testId: string | undefined) => {
	const {
		questions,
		answers,
		finishTest,
		setSubmitResult,
		setIsSubmitting,
		isSubmitting,
		submitResult
	} = useTestStore()

	const submitTest = useCallback(async () => {
		if (!testId || isSubmitting) return

		setIsSubmitting(true)

		try {
			const answersPayload: SubmitAnswerPayload[] = questions
				.map((question, index) => {
					const answerIndex = answers[index]
					if (answerIndex === null) return null

					const answer = question.answers[answerIndex]
					if (!answer) return null

					return {
						question_id: question.id,
						answer_id: answer.id
					}
				})
				.filter((item): item is SubmitAnswerPayload => item !== null)

			const result = await testApi.submitTest(Number(testId), answersPayload)
			console.log('API submit result:', result)
			setSubmitResult(result)
			finishTest()
		} catch (error) {
			console.error('Failed to submit test:', error)
			finishTest()
		} finally {
			setIsSubmitting(false)
		}
	}, [testId, questions, answers, isSubmitting, finishTest, setSubmitResult, setIsSubmitting])

	return {
		submitTest,
		isSubmitting,
		submitResult
	}
}
