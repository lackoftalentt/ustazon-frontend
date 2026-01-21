import { useSubjects } from '@/entities/subject/model/useSubjects'
import logo from '@/shared/assets/images/logo.png'
import { Button } from '@/shared/ui/button'
import { Dropdown } from '@/shared/ui/dropdown'
import { Input } from '@/shared/ui/input'
import { Modal } from '@/shared/ui/modal'
import { clsx } from 'clsx'
import {
	BookMarked,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Clock,
	ImagePlus,
	ListChecks,
	Plus,
	Trash2,
	X
} from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
	type CreateTestFormData,
	DIFFICULTY_LEVELS,
	type DifficultyLevel
} from '../../../model/types'
import { useCreateTestForm } from '../../../model/useCreateTestForm'
import { useCreateTestStore } from '../../../model/useCreateTestStore'
import s from './CreateTestModal.module.scss'

export const CreateTestModal = () => {
	const { isOpen, closeModal } = useCreateTestStore()
	const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

	const { data: subjects = [] } = useSubjects()

	const subjectItems = useMemo(
		() => subjects.map(subject => subject.name),
		[subjects]
	)

	const getSubjectNameByCode = useCallback(
		(code: string) => {
			const subject = subjects.find(s => s.code === code)
			return subject?.name || ''
		},
		[subjects]
	)

	const getSubjectCodeByName = useCallback(
		(name: string) => {
			const subject = subjects.find(s => s.name === name)
			return subject?.code || ''
		},
		[subjects]
	)

	const {
		register,
		setValue,
		watch,
		formState: { errors, isSubmitting },
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
	} = useCreateTestForm(async (data: CreateTestFormData) => {
		try {
			console.log('Creating test:', data)
			toast.success('Тест сәтті құрылды!')
			handleClose()
		} catch {
			toast.error('Тест құру кезінде қате орын алды')
		}
	})

	const handleClose = useCallback(() => {
		resetForm()
		setCurrentQuestionIndex(0)
		closeModal()
	}, [resetForm, closeModal])

	const difficulty = watch('difficulty')

	const handleImageChange = (
		questionIndex: number,
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0]
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast.error('Сурет өлшемі 5MB-дан аспауы керек')
				return
			}
			updateQuestionImage(questionIndex, file)
		}
		e.target.value = ''
	}

	const handleAddQuestion = () => {
		addQuestion()
		setCurrentQuestionIndex(questions.length)
	}

	const handleRemoveQuestion = (index: number) => {
		removeQuestion(index)
		if (currentQuestionIndex >= questions.length - 1) {
			setCurrentQuestionIndex(Math.max(0, questions.length - 2))
		}
	}

	const currentQuestion = questions[currentQuestionIndex]

	const hasQuestionError = (index: number) => {
		return !!errors.questions?.[index]
	}

	return (
		<Modal
			open={isOpen}
			onClose={handleClose}
		>
			<div className={s.header}>
				<div className={s.headerIcon}>
					<CheckCircle size={32} />
				</div>
				<div className={s.headerContent}>
					<h3 className={s.headerTitle}>Жаңа тест жасау</h3>
					<p className={s.headerSubtitle}>
						Оқушыларыңыздың білімін тексеру үшін интерактивті тест жасаңыз
					</p>
				</div>
				<img
					src={logo}
					alt="Logo"
					className={s.headerLogo}
				/>
			</div>

			<form
				onSubmit={onSubmit}
				className={s.form}
			>
				<div className={s.field}>
					<label className={s.label}>
						<BookMarked size={18} />
						Пән
					</label>
					<Dropdown
						items={subjectItems}
						value={getSubjectNameByCode(watch('subjectCode'))}
						placeholder="Пәнді таңдаңыз"
						onChange={name => {
							const code = getSubjectCodeByName(name)
							setValue('subjectCode', code, { shouldValidate: true })
						}}
					/>
					{errors.subjectCode && (
						<span className={s.error}>{errors.subjectCode.message}</span>
					)}
				</div>

				<div className={s.field}>
					<label className={s.label}>
						<ListChecks size={18} />
						Тест атауы *
					</label>
					<Input
						{...register('name')}
						placeholder="Тест атауын енгізіңіз"
						error={errors.name?.message}
					/>
				</div>

				<div className={s.row}>
					<div className={s.field}>
						<label className={s.label}>
							<Clock size={18} />
							Орындау уақыты (минут)
						</label>
						<div className={s.durationInput}>
							<button
								type="button"
								className={s.durationBtn}
								onClick={() =>
									handleDurationChange((watch('duration') || 30) - 5)
								}
							>
								−
							</button>
							<input
								type="number"
								className={s.durationValue}
								value={watch('duration') || 30}
								onChange={e =>
									handleDurationChange(parseInt(e.target.value) || 30)
								}
								min={5}
								max={180}
							/>
							<button
								type="button"
								className={s.durationBtn}
								onClick={() =>
									handleDurationChange((watch('duration') || 30) + 5)
								}
							>
								+
							</button>
						</div>
						{errors.duration && (
							<span className={s.error}>{errors.duration.message}</span>
						)}
					</div>

					<div className={s.field}>
						<label className={s.label}>Күрделілік деңгейі</label>
						<div className={s.difficultyOptions}>
							{DIFFICULTY_LEVELS.map(level => (
								<div
									key={level.value}
									className={clsx(
										s.difficultyOption,
										difficulty === level.value && s.selected
									)}
									onClick={() =>
										handleDifficultyChange(level.value as DifficultyLevel)
									}
								>
									<span>{level.label}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className={s.questionsSection}>
					<div className={s.sectionHeader}>
						<span className={s.sectionTitle}>
							<ListChecks size={20} />
							Сұрақтар ({questions.length})
						</span>
						<button
							type="button"
							className={s.addQuestionBtn}
							onClick={handleAddQuestion}
						>
							<Plus size={18} />
							Сұрақ қосу
						</button>
					</div>

					{/* Question Pagination */}
					<div className={s.questionPagination}>
						<button
							type="button"
							className={s.paginationArrow}
							onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
							disabled={currentQuestionIndex === 0}
						>
							<ChevronLeft size={20} />
						</button>

						<div className={s.paginationNav}>
							{questions.map((_, index) => (
								<button
									key={index}
									type="button"
									className={clsx(
										s.questionPageBtn,
										index === currentQuestionIndex && s.active,
										hasQuestionError(index) && s.hasError
									)}
									onClick={() => setCurrentQuestionIndex(index)}
								>
									{index + 1}
								</button>
							))}
						</div>

						<button
							type="button"
							className={s.paginationArrow}
							onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
							disabled={currentQuestionIndex === questions.length - 1}
						>
							<ChevronRight size={20} />
						</button>
					</div>

					{/* Current Question Card */}
					{currentQuestion && (
						<div
							key={currentQuestion.id}
							className={s.questionCard}
						>
							<div className={s.questionHeader}>
								<div className={s.questionNumber}>
									<span className={s.badge}>{currentQuestionIndex + 1}</span>
									Сұрақ {currentQuestionIndex + 1}
								</div>
								<button
									type="button"
									className={s.removeQuestionBtn}
									onClick={() => handleRemoveQuestion(currentQuestionIndex)}
									disabled={questions.length <= 1}
								>
									<Trash2 size={20} />
								</button>
							</div>

							<div className={s.field}>
								<label className={s.label}>Сұрақ мәтіні *</label>
								<textarea
									className={clsx(
										s.textarea,
										errors.questions?.[currentQuestionIndex]?.text && s.textareaError
									)}
									placeholder="Сұрақ мәтінін енгізіңіз..."
									value={currentQuestion.text}
									onChange={e => updateQuestionText(currentQuestionIndex, e.target.value)}
								/>
								{errors.questions?.[currentQuestionIndex]?.text && (
									<span className={s.error}>
										{errors.questions[currentQuestionIndex]?.text?.message}
									</span>
								)}
							</div>

							<div className={s.field}>
								<label className={s.label}>Сұрақ суреті (міндетті емес)</label>
								<div className={s.imageUpload}>
									<input
										ref={el => {
											imageInputRefs.current[currentQuestion.id] = el
										}}
										type="file"
										accept="image/*"
										className={s.hiddenInput}
										onChange={e => handleImageChange(currentQuestionIndex, e)}
									/>
									<button
										type="button"
										className={s.imageUploadBtn}
										onClick={() => imageInputRefs.current[currentQuestion.id]?.click()}
									>
										<ImagePlus size={18} />
										Сурет таңдау
									</button>
									{currentQuestion.image && (
										<div className={s.imagePreview}>
											<span>{currentQuestion.image.name}</span>
											<button
												type="button"
												className={s.removeImageBtn}
												onClick={() => updateQuestionImage(currentQuestionIndex, undefined)}
											>
												<X size={16} />
											</button>
										</div>
									)}
								</div>
							</div>

							<div className={s.answersSection}>
								<div className={s.answersHeader}>
									Жауап нұсқалары
									<span className={s.answersHint}>
										Дұрыс жауапты белгілеңіз
									</span>
								</div>
								<div className={s.answersList}>
									{currentQuestion.answers.map((answer, aIndex) => (
										<div
											key={answer.id}
											className={clsx(
												s.answerItem,
												answer.isCorrect && s.correct
											)}
										>
											<div
												className={clsx(
													s.answerRadio,
													answer.isCorrect && s.selected
												)}
												onClick={() => setCorrectAnswer(currentQuestionIndex, aIndex)}
											/>
											<span className={s.answerLabel}>Жауап {aIndex + 1}</span>
											<input
												className={s.answerInput}
												placeholder="Жауап мәтінін енгізіңіз..."
												value={answer.text}
												onChange={e =>
													updateAnswerText(currentQuestionIndex, aIndex, e.target.value)
												}
											/>
										</div>
									))}
								</div>
								{errors.questions?.[currentQuestionIndex]?.answers && (
									<span className={s.error}>
										{typeof errors.questions[currentQuestionIndex]?.answers?.message ===
										'string'
											? errors.questions[currentQuestionIndex]?.answers?.message
											: 'Жауап нұсқаларын тексеріңіз'}
									</span>
								)}
							</div>
						</div>
					)}
				</div>

				<div className={s.actions}>
					<Button
						type="button"
						variant="outline"
						onClick={handleClose}
					>
						Артқа қайту
					</Button>
					<Button
						type="submit"
						variant="primary"
						loading={isSubmitting}
					>
						Тестті жасау
					</Button>
				</div>
			</form>
		</Modal>
	)
}
