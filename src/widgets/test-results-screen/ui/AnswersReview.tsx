import type { QuestionResult } from '@/features/take-test'
import { CheckCircle, XCircle } from 'lucide-react'
import s from './AnswersReview.module.scss'

interface AnswersReviewProps {
	questionsResults: QuestionResult[]
}

export const AnswersReview = ({ questionsResults }: AnswersReviewProps) => {
	return (
		<div className={s.answersReview}>
			<h2 className={s.sectionTitle}>Жауаптарды талдау</h2>
			<div className={s.questionsList}>
				{questionsResults.map((question, index) => (
					<div
						key={question.question_id}
						className={`${s.questionCard} ${question.is_correct ? s.correct : s.incorrect}`}
					>
						<div className={s.questionHeader}>
							<span className={s.questionNumber}>{index + 1}-сұрақ</span>
							<span
								className={`${s.questionStatus} ${question.is_correct ? s.correct : s.incorrect}`}
							>
								{question.is_correct ? (
									<>
										<CheckCircle size={16} />
										Дұрыс
									</>
								) : (
									<>
										<XCircle size={16} />
										Қате
									</>
								)}
							</span>
						</div>
						<p className={s.questionText}>{question.question_text}</p>
						<div className={s.answersList}>
							{question.answers.map(answer => {
								const isSelected = answer.id === question.selected_answer_id
								const isCorrect = answer.is_correct

								let answerClass = s.answer
								if (isCorrect) {
									answerClass += ` ${s.correctAnswer}`
								} else if (isSelected && !isCorrect) {
									answerClass += ` ${s.wrongAnswer}`
								}

								return (
									<div
										key={answer.id}
										className={answerClass}
									>
										<span className={s.answerText}>{answer.text}</span>
										{isCorrect && (
											<span className={s.answerBadge}>
												<CheckCircle size={14} />
												Дұрыс жауап
											</span>
										)}
										{isSelected && !isCorrect && (
											<span className={`${s.answerBadge} ${s.wrong}`}>
												<XCircle size={14} />
												Сіздің жауабыңыз
											</span>
										)}
										{isSelected && isCorrect && (
											<span className={s.answerBadge}>
												<CheckCircle size={14} />
												Сіздің жауабыңыз
											</span>
										)}
									</div>
								)
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
