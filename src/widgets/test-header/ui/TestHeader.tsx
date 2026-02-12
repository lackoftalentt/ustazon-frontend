import { formatTime, getTimeColor } from '@/shared/lib/formatTime'
import { Progress } from '@/shared/ui/progress'
import { Timer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import s from './TestHeader.module.scss'

interface TestHeaderProps {
	title: string
	currentQuestionIndex: number
	totalQuestions: number
	remainingTime: number
	answeredCount: number
	progress: number
	questionsAnswered: boolean[]
	onGoToQuestion: (index: number) => void
}

export const TestHeader = ({
	title,
	currentQuestionIndex,
	totalQuestions,
	remainingTime,
	answeredCount,
	progress,
	questionsAnswered,
	onGoToQuestion
}: TestHeaderProps) => {
	const timeColor = getTimeColor(remainingTime)
	const { t } = useTranslation()

	return (
		<>
			<div className={s.testHeader}>
				<div className={s.headerLeft}>
					<h1 className={s.testTitle}>{title}</h1>
					<div className={s.questionBadge}>
						<span className={s.current}>{currentQuestionIndex + 1}</span>
						<span className={s.separator}>/</span>
						<span className={s.total}>{totalQuestions}</span>
					</div>
				</div>

				<div className={`${s.timerContainer} ${s[timeColor]}`}>
					<Timer size={20} />
					<span className={s.timer}>{formatTime(remainingTime)}</span>
				</div>
			</div>

			<div className={s.progressSection}>
				<Progress value={progress} size="md" animated={true} />
				<div className={s.progressInfo}>
					<span className={s.progressText}>
						{t('tests.answered')} <strong>{answeredCount}</strong> / {totalQuestions}
					</span>
					<span className={s.progressPercentage}>{Math.round(progress)}%</span>
				</div>
			</div>

			<div className={s.questionNavigation}>
				{questionsAnswered.map((isAnswered, index) => (
					<button
						key={index}
						className={`${s.navDot} ${index === currentQuestionIndex ? s.active : ''} ${isAnswered ? s.answered : ''}`}
						onClick={() => onGoToQuestion(index)}
						aria-label={`Go to question ${index + 1}`}
					>
						{index + 1}
					</button>
				))}
			</div>
		</>
	)
}
