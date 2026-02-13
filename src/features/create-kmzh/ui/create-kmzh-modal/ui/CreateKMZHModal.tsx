import {
	useInstitutionTypes,
	useSubjects
} from '@/entities/subject/model/useSubjects'
import logo from '@/shared/assets/images/logo.png'
import { Button } from '@/shared/ui/button'
import { Dropdown } from '@/shared/ui/dropdown'
import { Input } from '@/shared/ui/input'
import { Modal } from '@/shared/ui/modal'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { clsx } from 'clsx'
import {
	BookMarked,
	BookOpen,
	Calendar,
	Clock,
	FileText,
	GraduationCap,
	Target,
	Upload,
	X
} from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import {
	CLASS_LEVELS,
	MAX_FILE_SIZE,
	QUARTERS,
	type ClassLevel,
	type Quarter
} from '../../../model/types'
import { useCreateKMZHForm } from '../../../model/useCreateKMZHForm'
import { useCreateKMZHStore } from '../../../model/useCreateKMZHStore'
import s from './CreateKMZHModal.module.scss'

const formatFileSize = (bytes: number): string => {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const CreateKMZHModal = () => {
	const { t } = useTranslation()
	const { isOpen, closeModal } = useCreateKMZHStore()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragOver, setIsDragOver] = useState(false)
	const queryClient = useQueryClient()

	const { data: subjects = [] } = useSubjects()
	const { data: institutionTypes = [] } = useInstitutionTypes()

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

	const getSubjectIdByCode = useCallback(
		(code: string) => {
			const subject = subjects.find(s => s.code === code)
			return subject?.id
		},
		[subjects]
	)

	const {
		register,
		setValue,
		watch,
		formState: { errors, isSubmitting },
		files,
		institutionTypeIds,
		handleAddFiles,
		handleRemoveFile,
		handleHoursChange,
		handleInstitutionToggle,
		resetForm,
		onSubmit
	} = useCreateKMZHForm(
		async () => {
			queryClient.invalidateQueries({ queryKey: ['qmj'] })
			toast.success(t('createKmzh.success'))
			handleClose()
		},
		{ getSubjectIdByCode }
	)

	const handleClose = useCallback(() => {
		resetForm()
		closeModal()
	}, [resetForm, closeModal])

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragOver(true)
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragOver(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragOver(false)
		if (e.dataTransfer.files?.length) {
			const droppedFiles = Array.from(e.dataTransfer.files)
			const validFiles = droppedFiles.filter(file => {
				if (file.size > MAX_FILE_SIZE) {
					toast.error(t('createKmzh.fileTooLarge', { name: file.name }))
					return false
				}
				return true
			})
			handleAddFiles(validFiles)
		}
	}

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) {
			const selectedFiles = Array.from(e.target.files)
			const validFiles = selectedFiles.filter(file => {
				if (file.size > MAX_FILE_SIZE) {
					toast.error(t('createKmzh.fileTooLarge', { name: file.name }))
					return false
				}
				return true
			})
			handleAddFiles(validFiles)
		}
		e.target.value = ''
	}

	return (
		<Modal
			open={isOpen}
			onClose={handleClose}
		>
			<div className={s.header}>
				<div className={s.headerIcon}>
					<FileText size={28} />
				</div>
				<div className={s.headerContent}>
					<h3 className={s.headerTitle}>{t('createKmzh.title')}</h3>
					<p className={s.headerSubtitle}>{t('createKmzh.subtitle')}</p>
				</div>
				<img
					src={logo}
					alt="Logo"
					className={s.headerLogo}
				/>
			</div>

			<form
				onSubmit={async e => {
					try {
						await onSubmit(e)
					} catch (error) {
						if (error instanceof AxiosError) {
							toast.error(
								error.response?.data?.detail ||
									t('createKmzh.error')
							)
						} else {
							toast.error(t('createKmzh.error'))
						}
					}
				}}
				className={s.form}
			>
				<div className={s.field}>
					<label className={s.label}>
						<BookMarked size={16} />
						{t('createKmzh.subject')}
					</label>
					<Dropdown
						items={subjectItems}
						value={getSubjectNameByCode(watch('subjectCode'))}
						placeholder={t('createKmzh.selectSubject')}
						onChange={name => {
							const code = getSubjectCodeByName(name)
							setValue('subjectCode', code, { shouldValidate: true })
						}}
					/>
					{errors.subjectCode && (
						<span className={s.error}>{errors.subjectCode.message}</span>
					)}
				</div>

				<div className={s.row}>
					<div className={s.field}>
						<label className={s.label}>
							<GraduationCap size={16} />
							{t('createKmzh.grade')}
						</label>
						<Dropdown
							items={[...CLASS_LEVELS]}
							value={watch('classLevel')}
							placeholder={t('createKmzh.selectGrade')}
							onChange={v =>
								setValue('classLevel', v as ClassLevel, {
									shouldValidate: true
								})
							}
						/>
						{errors.classLevel && (
							<span className={s.error}>{errors.classLevel.message}</span>
						)}
					</div>

					<div className={s.field}>
						<label className={s.label}>
							<Calendar size={16} />
							{t('createKmzh.quarter')}
						</label>
						<Dropdown
							items={[...QUARTERS]}
							value={watch('quarter')}
							placeholder={t('createKmzh.selectQuarter')}
							onChange={v =>
								setValue('quarter', v as Quarter, { shouldValidate: true })
							}
						/>
						{errors.quarter && (
							<span className={s.error}>{errors.quarter.message}</span>
						)}
					</div>
				</div>

				<div className={s.field}>
					<label className={s.label}>
						<Clock size={16} />
						{t('createKmzh.hours')}
					</label>
					<div className={s.hoursInput}>
						<button
							type="button"
							className={s.hoursBtn}
							onClick={() => handleHoursChange((watch('hours') || 1) - 1)}
						>
							−
						</button>
						<input
							type="number"
							className={s.hoursValue}
							value={watch('hours') || 1}
							onChange={e => handleHoursChange(parseInt(e.target.value) || 1)}
							min={1}
							max={10}
						/>
						<button
							type="button"
							className={s.hoursBtn}
							onClick={() => handleHoursChange((watch('hours') || 1) + 1)}
						>
							+
						</button>
					</div>
					<span className={s.hint}>{t('createKmzh.hoursHint')}</span>
					{errors.hours && (
						<span className={s.error}>{errors.hours.message}</span>
					)}
				</div>

				<div className={s.field}>
					<label className={s.label}>
						<BookOpen size={16} />
						{t('createKmzh.topic')}
					</label>
					<Input
						{...register('lessonTopic')}
						placeholder={t('createKmzh.topicPlaceholder')}
						error={errors.lessonTopic?.message}
					/>
					<span className={s.hint}>{t('createKmzh.topicHint')}</span>
				</div>

				<div className={s.field}>
					<label className={s.label}>
						<Target size={16} />
						{t('createKmzh.objectives')}
					</label>
					<textarea
						{...register('learningObjectives')}
						className={clsx(
							s.textarea,
							errors.learningObjectives && s.textareaError
						)}
						placeholder={t('createKmzh.objectivesPlaceholder')}
						rows={4}
					/>
					<span className={s.hint}>
						{t('createKmzh.objectivesHint')}
					</span>
					{errors.learningObjectives && (
						<span className={s.error}>{errors.learningObjectives.message}</span>
					)}
				</div>

				<div className={s.field}>
					<label className={s.label}>{t('createKmzh.files')}</label>
					<input
						ref={fileInputRef}
						type="file"
						multiple
						onChange={handleFileInputChange}
						className={s.hiddenInput}
					/>
					<div
						className={clsx(
							s.dropzone,
							isDragOver && s.dragOver,
							errors.files && s.hasError
						)}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onClick={() => fileInputRef.current?.click()}
					>
						<Upload size={32} />
						<div className={s.dropzoneText}>
							<span className={s.dropzoneTitle}>
								{t('createKmzh.dragFiles')}
							</span>
							<span className={s.dropzoneHint}>{t('createKmzh.maxFileSize')}</span>
						</div>
					</div>
					{errors.files && (
						<span className={s.error}>{errors.files.message}</span>
					)}

					{files.length > 0 && (
						<div className={s.fileList}>
							{files.map((file, index) => (
								<div
									key={`${file.name}-${index}`}
									className={s.fileItem}
								>
									<FileText
										size={20}
										className={s.fileIcon}
									/>
									<div className={s.fileInfo}>
										<span className={s.fileName}>{file.name}</span>
										<span className={s.fileSize}>
											{formatFileSize(file.size)}
										</span>
									</div>
									<button
										type="button"
										className={s.fileRemove}
										onClick={() => handleRemoveFile(index)}
									>
										<X size={16} />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				<div className={s.subjectsSection}>
					<div className={s.subjectsHeader}>
						<span className={s.sectionTitle}>{t('createKmzh.institutionType')}</span>
						<span className={s.sectionHint}>{t('createKmzh.multipleTypes')}</span>
					</div>

					<div className={s.subjectsGrid}>
						{institutionTypes.map(institution => (
							<div
								key={institution.id}
								className={clsx(
									s.subjectItem,
									institutionTypeIds.includes(institution.id) && s.selected
								)}
								onClick={() => handleInstitutionToggle(institution.id)}
							>
								<input
									type="checkbox"
									className={s.subjectCheckbox}
									checked={institutionTypeIds.includes(institution.id)}
									readOnly
								/>
								<span className={s.subjectName}>{institution.name}</span>
							</div>
						))}
					</div>
				</div>

				<div className={s.actions}>
					<Button
						type="button"
						variant="outline"
						onClick={handleClose}
					>
						{t('createKmzh.cancel')}
					</Button>
					<Button
						type="submit"
						variant="primary"
						loading={isSubmitting}
					>
						{t('createKmzh.addKmzh')}
					</Button>
				</div>
			</form>
		</Modal>
	)
}
