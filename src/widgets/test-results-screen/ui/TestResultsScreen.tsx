import type { QuestionResult } from '@/features/take-test'
import { formatTime } from '@/shared/lib/formatTime'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import {
	CheckCircle,
	Clock,
	RotateCcw,
	Target,
	Trophy,
	XCircle
} from 'lucide-react'
import { AnswersReview } from './AnswersReview'
import s from './TestResultsScreen.module.scss'

interface TestResultsScreenProps {
	score: number
	totalQuestions: number
	scorePercentage: number
	passed?: boolean
	grade: {
		label: string
		color: 'excellent' | 'good' | 'average' | 'poor'
	}
	elapsedTime: number
	questionsResults?: QuestionResult[]
	onRestart: () => void
	onBack: () => void
}

export const TestResultsScreen = ({
	score,
	totalQuestions,
	scorePercentage,
	passed,
	grade,
	elapsedTime,
	questionsResults,
	onRestart,
	onBack
}: TestResultsScreenProps) => {
	return (
		<main className={s.takeTestPage}>
			<Container className={s.container}>
				<div className={s.resultsContainer}>
					<div className={s.resultsHeader}>
						<div className={s.trophyIcon}>
							<Trophy size={48} />
						</div>
						<h1 className={s.resultsTitle}>Тест аяқталды!</h1>
						<p className={s.resultsSubtitle}>
							{passed !== undefined && (
								<span className={passed ? s.passedText : s.failedText}>
									{passed ? 'Сіз тесттен өттіңіз!' : 'Тест тапсырылмады'}
								</span>
							)}
						</p>
					</div>

					<div className={s.resultsCard}>
						<div className={s.scoreSection}>
							<div
								className={`${s.scoreCircle} ${s[grade.color]}`}
								style={
									{
										'--score-percentage': scorePercentage
									} as React.CSSProperties
								}
							>
								<div className={s.scoreInner}>
									<div className={s.scoreValue}>
										{score}
										<span>/{totalQuestions}</span>
									</div>
									<div className={s.scorePercentage}>{scorePercentage}%</div>
								</div>
							</div>
							<div className={`${s.gradeLabel} ${s[grade.color]}`}>
								{grade.label}
							</div>
						</div>

						<div className={s.statsGrid}>
							<div className={s.statCard}>
								<div className={s.statIcon}>
									<CheckCircle size={24} />
								</div>
								<div className={s.statInfo}>
									<div className={s.statLabel}>Дұрыс жауаптар</div>
									<div className={s.statValue}>{score}</div>
								</div>
							</div>
							<div className={s.statCard}>
								<div className={`${s.statIcon} ${s.error}`}>
									<XCircle size={24} />
								</div>
								<div className={s.statInfo}>
									<div className={s.statLabel}>Қате жауаптар</div>
									<div className={s.statValue}>{totalQuestions - score}</div>
								</div>
							</div>
							<div className={s.statCard}>
								<div className={`${s.statIcon} ${s.time}`}>
									<Clock size={24} />
								</div>
								<div className={s.statInfo}>
									<div className={s.statLabel}>Жұмсалған уақыт</div>
									<div className={s.statValue}>{formatTime(elapsedTime)}</div>
								</div>
							</div>
							<div className={s.statCard}>
								<div className={`${s.statIcon} ${s.target}`}>
									<Target size={24} />
								</div>
								<div className={s.statInfo}>
									<div className={s.statLabel}>Дәлдік</div>
									<div className={s.statValue}>{scorePercentage}%</div>
								</div>
							</div>
						</div>

						<div className={s.resultsButtons}>
							<Button
								className={s.primaryButton}
								onClick={onRestart}
							>
								<RotateCcw size={18} />
								Тестті қайта бастау
							</Button>
							<Button
								className={s.secondaryButton}
								onClick={onBack}
							>
								Тесттер тізіміне оралу
							</Button>
						</div>
					</div>

					{questionsResults && questionsResults.length > 0 && (
						<AnswersReview questionsResults={questionsResults} />
					)}
				</div>
			</Container>
		</main>
	)
}
