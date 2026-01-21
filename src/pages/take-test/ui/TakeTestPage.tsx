import {
	useSubmitTest,
	useTestData,
	useTestScore,
	useTestStore,
	useTestTimer
} from '@/features/take-test'
import { LoaderPage } from '@/pages/loader-page'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { TestHeader } from '@/widgets/test-header'
import { TestNavigation } from '@/widgets/test-navigation'
import { TestQuestionCard } from '@/widgets/test-question-card'
import { TestResultsScreen } from '@/widgets/test-results-screen'
import { TestStartScreen } from '@/widgets/test-start-screen'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import s from './TakeTestPage.module.scss'

export const TakeTestPage = () => {
	const navigate = useNavigate()
	const { testId } = useParams<{ testId: string }>()

	const [isTestReady, setIsTestReady] = useState(false)

	const { testData, isLoading, error, handleStartTest, handleRestartTest } =
		useTestData(testId)
	const { remainingTime } = useTestTimer()
	const {
		totalQuestions,
		elapsedTime,
		answeredCount,
		progress,
		allQuestionsAnswered
	} = useTestScore()
	const { submitTest, isSubmitting, submitResult } = useSubmitTest(testId)

	const {
		questions,
		currentQuestionIndex,
		answers,
		isTestCompleted,
		selectAnswer,
		nextQuestion,
		previousQuestion,
		goToQuestion,
		isQuestionAnswered
	} = useTestStore()

	const currentQuestion = questions[currentQuestionIndex]
	const currentAnswer = answers[currentQuestionIndex]

	const onStartTest = () => {
		handleStartTest()
		setIsTestReady(true)
	}

	const onRestartTest = async () => {
		await handleRestartTest()
		setIsTestReady(true)
	}

	const handleSelectAnswer = (optionIndex: number) => {
		if (isTestCompleted) return
		selectAnswer(currentQuestionIndex, optionIndex)
	}

	const handleNext = () => {
		if (currentQuestionIndex < totalQuestions - 1) {
			nextQuestion()
		}
	}

	const handleFinishTest = async () => {
		if (allQuestionsAnswered && !isSubmitting) {
			await submitTest()
		}
	}

	const handleBack = () => navigate('/tests')

	if (isLoading) {
		return <LoaderPage />
	}

	if (error) {
		return (
			<main className={s.takeTestPage}>
				<Container className={s.container}>
					<div className={s.errorContainer}>
						<AlertCircle
							size={48}
							className={s.errorIcon}
						/>
						<p className={s.errorText}>{error}</p>
						<Button onClick={handleBack}>Тесттер тізіміне оралу</Button>
					</div>
				</Container>
			</main>
		)
	}

	if (!isTestReady && testData) {
		return (
			<TestStartScreen
				testData={testData}
				onStart={onStartTest}
				onBack={handleBack}
			/>
		)
	}

	if (isSubmitting) {
		return <LoaderPage />
	}

	if (isTestCompleted && submitResult) {
		const getGrade = (percentage: number) => {
			if (percentage >= 90)
				return { label: 'Өте жақсы', color: 'excellent' as const }
			if (percentage >= 70) return { label: 'Жақсы', color: 'good' as const }
			if (percentage >= 50)
				return { label: 'Қанағаттанарлық', color: 'average' as const }
			return { label: 'Қанағаттанарлықсыз', color: 'poor' as const }
		}

		return (
			<TestResultsScreen
				score={submitResult.correct_answers}
				totalQuestions={submitResult.total_questions}
				scorePercentage={submitResult.score_percentage}
				passed={submitResult.passed}
				grade={getGrade(submitResult.score_percentage)}
				elapsedTime={elapsedTime}
				questionsResults={submitResult.questions_results}
				onRestart={onRestartTest}
				onBack={handleBack}
			/>
		)
	}

	if (!currentQuestion) {
		return (
			<main className={s.takeTestPage}>
				<Container className={s.container}>
					<div className={s.loadingContainer}>
						<Loader2
							className={s.spinner}
							size={48}
						/>
						<p className={s.loadingText}>Жүктелуде...</p>
					</div>
				</Container>
			</main>
		)
	}

	const questionsAnswered = questions.map((_, index) =>
		isQuestionAnswered(index)
	)

	return (
		<main className={s.takeTestPage}>
			<Container className={s.container}>
				<div className={s.testContainer}>
					<TestHeader
						title={testData?.title || 'Тест'}
						currentQuestionIndex={currentQuestionIndex}
						totalQuestions={totalQuestions}
						remainingTime={remainingTime}
						answeredCount={answeredCount}
						progress={progress}
						questionsAnswered={questionsAnswered}
						onGoToQuestion={goToQuestion}
					/>

					<TestQuestionCard
						question={currentQuestion}
						questionIndex={currentQuestionIndex}
						currentAnswer={currentAnswer}
						isTestCompleted={isTestCompleted}
						onSelectAnswer={handleSelectAnswer}
					/>

					<TestNavigation
						currentQuestionIndex={currentQuestionIndex}
						totalQuestions={totalQuestions}
						allQuestionsAnswered={allQuestionsAnswered}
						onPrevious={previousQuestion}
						onNext={handleNext}
						onFinish={handleFinishTest}
					/>
				</div>
			</Container>
		</main>
	)
}

export default TakeTestPage
