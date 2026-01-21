import { useMemo } from 'react'
import { useTestStore } from './useTestStore'

type ScoreGrade = {
	label: string
	color: 'excellent' | 'good' | 'average' | 'poor'
}

export const useTestScore = () => {
	const { questions, answers, getScore, getElapsedTime } = useTestStore()

	const totalQuestions = questions.length
	const score = getScore()
	const elapsedTime = getElapsedTime()

	const scorePercentage = useMemo(() => {
		return totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
	}, [score, totalQuestions])

	const grade: ScoreGrade = useMemo(() => {
		if (scorePercentage >= 90) return { label: 'Өте жақсы!', color: 'excellent' }
		if (scorePercentage >= 70) return { label: 'Жақсы', color: 'good' }
		if (scorePercentage >= 50) return { label: 'Қанағаттанарлық', color: 'average' }
		return { label: 'Қайта оқу қажет', color: 'poor' }
	}, [scorePercentage])

	const answeredCount = useMemo(() => {
		return answers.filter(a => a !== null).length
	}, [answers])

	const progress = useMemo(() => {
		return totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0
	}, [answeredCount, totalQuestions])

	const allQuestionsAnswered = answeredCount === totalQuestions && totalQuestions > 0

	return {
		score,
		totalQuestions,
		scorePercentage,
		grade,
		elapsedTime,
		answeredCount,
		progress,
		allQuestionsAnswered
	}
}
