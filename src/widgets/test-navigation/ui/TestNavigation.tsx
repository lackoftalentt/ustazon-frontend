import { Button } from '@/shared/ui/button'
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react'
import s from './TestNavigation.module.scss'

interface TestNavigationProps {
	currentQuestionIndex: number
	totalQuestions: number
	allQuestionsAnswered: boolean
	onPrevious: () => void
	onNext: () => void
	onFinish: () => void
}

export const TestNavigation = ({
	currentQuestionIndex,
	totalQuestions,
	allQuestionsAnswered,
	onPrevious,
	onNext,
	onFinish
}: TestNavigationProps) => {
	const isFirstQuestion = currentQuestionIndex === 0
	const isLastQuestion = currentQuestionIndex === totalQuestions - 1

	return (
		<>
			<div className={s.navigation}>
				<Button
					className={s.prevButton}
					onClick={onPrevious}
					disabled={isFirstQuestion}
				>
					<ChevronLeft size={20} />
					Алдыңғы
				</Button>

				<div className={s.navInfo}>
					Сұрақ {currentQuestionIndex + 1} / {totalQuestions}
				</div>

				<Button
					className={s.nextButton}
					onClick={onNext}
					disabled={isLastQuestion}
				>
					Келесі
					<ChevronRight size={20} />
				</Button>
			</div>

			<div className={s.finishSection}>
				<Button
					className={`${s.finishButton} ${!allQuestionsAnswered ? s.disabled : ''}`}
					onClick={onFinish}
					disabled={!allQuestionsAnswered}
				>
					<Flag size={20} />
					Тестті аяқтау
				</Button>
			</div>
		</>
	)
}
