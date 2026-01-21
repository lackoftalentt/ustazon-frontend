import { useEffect, useState } from 'react'
import { testApi, type TestToTake } from '@/entities/test'
import { useTestStore } from './useTestStore'
import type { Question } from './types'

const transformQuestions = (testData: TestToTake): Question[] => {
	return testData.questions
		.sort((a, b) => a.order - b.order)
		.map(q => ({
			id: q.id,
			text: q.text,
			photo: q.photo || null,
			video: q.video || null,
			order: q.order,
			answers: q.answers.sort((a, b) => a.order - b.order)
		}))
}

export const useTestData = (testId: string | undefined) => {
	const [testData, setTestData] = useState<TestToTake | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const { startTest, resetTest } = useTestStore()

	useEffect(() => {
		const fetchTest = async () => {
			if (!testId) {
				setError('Тест ID табылмады')
				setIsLoading(false)
				return
			}

			try {
				setIsLoading(true)
				setError(null)
				const data = await testApi.getTestToTake(Number(testId))
				setTestData(data)
			} catch (err) {
				setError('Тест жүктелмеді. Қайтадан көріңіз.')
				console.error('Failed to fetch test:', err)
			} finally {
				setIsLoading(false)
			}
		}

		fetchTest()
	}, [testId])

	const handleStartTest = () => {
		if (!testData) return

		const transformedQuestions = transformQuestions(testData)
		const timeLimitSeconds = testData.duration * 60

		resetTest()
		startTest(transformedQuestions, timeLimitSeconds)
	}

	const handleRestartTest = async () => {
		if (!testId) return

		try {
			setIsLoading(true)
			const data = await testApi.getTestToTake(Number(testId))
			setTestData(data)

			const transformedQuestions = transformQuestions(data)
			const timeLimitSeconds = data.duration * 60

			resetTest()
			startTest(transformedQuestions, timeLimitSeconds)
		} catch (err) {
			setError('Тест жүктелмеді. Қайтадан көріңіз.')
		} finally {
			setIsLoading(false)
		}
	}

	return {
		testData,
		isLoading,
		error,
		handleStartTest,
		handleRestartTest
	}
}
