import type { Question } from '@/features/take-test'
import { getFileUrl } from '@/shared/lib/fileUrl'
import { AlertCircle, CheckCircle } from 'lucide-react'
import s from './TestQuestionCard.module.scss'

interface TestQuestionCardProps {
	question: Question
	questionIndex: number
	currentAnswer: number | null
	isTestCompleted: boolean
	onSelectAnswer: (answerIndex: number) => void
}

export const TestQuestionCard = ({
	question,
	questionIndex,
	currentAnswer,
	isTestCompleted,
	onSelectAnswer
}: TestQuestionCardProps) => {
	const handleSelectAnswer = (optionIndex: number) => {
		if (isTestCompleted) return
		onSelectAnswer(optionIndex)
	}

	return (
		<div className={s.questionCard}>
			<div className={s.questionHeader}>
				<div className={s.questionNumber}>Сұрақ №{questionIndex + 1}</div>
				{currentAnswer === null && (
					<div className={s.unansweredHint}>
						<AlertCircle size={16} />
						Жауап таңдаңыз
					</div>
				)}
			</div>

			{question.photo && (
				<div className={s.questionMedia}>
					<img src={getFileUrl(question.photo)} alt="Сұрақ суреті" />
				</div>
			)}

			{question.video && (
				<div className={s.questionMedia}>
					<video src={getFileUrl(question.video)} controls />
				</div>
			)}

			<h2 className={s.questionText}>{question.text}</h2>

			<div className={s.optionsGrid}>
				{question.answers.map((answer, index) => {
					const isSelected = currentAnswer === index

					return (
						<button
							key={answer.id}
							className={`${s.option} ${isSelected ? s.selected : ''}`}
							onClick={() => handleSelectAnswer(index)}
						>
							<div className={s.optionContent}>
								<span className={`${s.optionLetter} ${isSelected ? s.selected : ''}`}>
									{String.fromCharCode(65 + index)}
								</span>
								<span className={s.optionText}>{answer.text}</span>
							</div>
							{isSelected && (
								<div className={s.selectedIndicator}>
									<CheckCircle size={20} />
								</div>
							)}
						</button>
					)
				})}
			</div>
		</div>
	)
}
