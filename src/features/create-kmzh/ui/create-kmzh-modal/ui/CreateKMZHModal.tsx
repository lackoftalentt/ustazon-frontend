import { useSubjects } from '@/entities/subject/model/useSubjects'
import logo from '@/shared/assets/images/logo.png'
import { Button } from '@/shared/ui/button'
import { Dropdown } from '@/shared/ui/dropdown'
import { Input } from '@/shared/ui/input'
import { Modal } from '@/shared/ui/modal'
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
import {
	CLASS_LEVELS,
	MAX_FILE_SIZE,
	QUARTERS,
	type ClassLevel,
	type CreateKMZHFormData,
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
	const { isOpen, closeModal } = useCreateKMZHStore()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragOver, setIsDragOver] = useState(false)

	const { data: subjects = [] } = useSubjects()

	// Map subjects to dropdown items (show name, but store code)
	const subjectItems = useMemo(
		() => subjects.map(subject => subject.name),
		[subjects]
	)

	// Get subject name by code for display
	const getSubjectNameByCode = useCallback(
		(code: string) => {
			const subject = subjects.find(s => s.code === code)
			return subject?.name || ''
		},
		[subjects]
	)

	// Get subject code by name for storage
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
		files,
		handleAddFiles,
		handleRemoveFile,
		handleHoursChange,
		resetForm,
		onSubmit
	} = useCreateKMZHForm(async (data: CreateKMZHFormData) => {
		try {
			console.log('Creating KMZH:', data)
			toast.success('ҚМЖ сәтті қосылды!')
			handleClose()
		} catch {
			toast.error('ҚМЖ қосу кезінде қате орын алды')
		}
	})

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
					toast.error(`"${file.name}" файлы тым үлкен (макс. 20MB)`)
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
					toast.error(`"${file.name}" файлы тым үлкен (макс. 20MB)`)
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
					<h3 className={s.headerTitle}>Жаңа ҚМЖ қосу</h3>
					<p className={s.headerSubtitle}>Сабақ жоспарын толтырыңыз</p>
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
						<BookMarked size={16} />
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

				<div className={s.row}>
					<div className={s.field}>
						<label className={s.label}>
							<GraduationCap size={16} />
							Сынып
						</label>
						<Dropdown
							items={[...CLASS_LEVELS]}
							value={watch('classLevel')}
							placeholder="Сыныпты таңдаңыз"
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
							Тоқсан
						</label>
						<Dropdown
							items={[...QUARTERS]}
							value={watch('quarter')}
							placeholder="Тоқсанды таңдаңыз"
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
						Сағат саны
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
					<span className={s.hint}>Сабаққа бөлінген сағат саны (1-10)</span>
					{errors.hours && (
						<span className={s.error}>{errors.hours.message}</span>
					)}
				</div>

				<div className={s.field}>
					<label className={s.label}>
						<BookOpen size={16} />
						Сабақ тақырыбы
					</label>
					<Input
						{...register('lessonTopic')}
						placeholder="Сабақ тақырыбын енгізіңіз"
						error={errors.lessonTopic?.message}
					/>
					<span className={s.hint}>Сабақтың толық тақырыбын жазыңыз</span>
				</div>

				<div className={s.field}>
					<label className={s.label}>
						<Target size={16} />
						Оқу мақсаттары
					</label>
					<textarea
						{...register('learningObjectives')}
						className={clsx(
							s.textarea,
							errors.learningObjectives && s.textareaError
						)}
						placeholder="Оқу мақсаттарын енгізіңіз"
						rows={4}
					/>
					<span className={s.hint}>
						Оқу бағдарламасындағы мақсаттарды көрсетіңіз
					</span>
					{errors.learningObjectives && (
						<span className={s.error}>{errors.learningObjectives.message}</span>
					)}
				</div>

				<div className={s.field}>
					<label className={s.label}>Файлдар</label>
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
								Файлдарды осында сүйреңіз немесе таңдаңыз
							</span>
							<span className={s.dropzoneHint}>Максималды өлшемі: 20MB</span>
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

				<div className={s.actions}>
					<Button
						type="button"
						variant="outline"
						onClick={handleClose}
					>
						Бас тарту
					</Button>
					<Button
						type="submit"
						variant="primary"
						loading={isSubmitting}
					>
						ҚМЖ қосу
					</Button>
				</div>
			</form>
		</Modal>
	)
}
