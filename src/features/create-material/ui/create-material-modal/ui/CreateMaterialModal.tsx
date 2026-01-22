import { cardApi, type CardCreate } from '@/entities/card/api/cardApi'
import { useCardTopics } from '@/entities/card/model/useCards'
import {
	useInstitutionTypes,
	useSubjects,
	useWindows
} from '@/entities/subject/model/useSubjects'
import { uploadApi } from '@/shared/api/uploadApi'
import logo from '@/shared/assets/images/logo.png'
import { Button } from '@/shared/ui/button'
import { Dropdown } from '@/shared/ui/dropdown'
import { Input } from '@/shared/ui/input'
import { Modal } from '@/shared/ui/modal'
import { clsx } from 'clsx'
import { BookMarked, Calendar, GraduationCap, LayoutGrid } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
	CLASS_OPTIONS,
	TERM_OPTIONS,
	type CreateMaterialFormData
} from '../../../model/types'
import { useCreateMaterialForm } from '../../../model/useCreateMaterialForm'
import { useCreateMaterialStore } from '../../../model/useCreateMaterialStore'
import s from './CreateMaterialModal.module.scss'

const parseGrade = (classLevel?: string): number | undefined => {
	if (!classLevel) return undefined
	const match = classLevel.match(/^(\d+)/)
	return match ? parseInt(match[1], 10) : undefined
}

const parseQuarter = (term?: string): number | undefined => {
	if (!term) return undefined
	const match = term.match(/^(\d+)/)
	return match ? parseInt(match[1], 10) : undefined
}

export const CreateMaterialModal = () => {
	const { isOpen, closeModal } = useCreateMaterialStore()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragOver, setIsDragOver] = useState(false)

	const { data: subjects = [] } = useSubjects()
	const { data: windows = [] } = useWindows()
	const { data: institutionTypes = [] } = useInstitutionTypes()
	const { data: topics = [] } = useCardTopics()

	const {
		register,
		setValue,
		watch,
		formState: { errors, isSubmitting },
		sourceType,
		subjectIds,
		institutionTypeIds,
		handleSourceTypeChange,
		handleFileChange,
		handleSubjectToggle,
		handleInstitutionToggle,
		resetForm,
		onSubmit
	} = useCreateMaterialForm(async (data: CreateMaterialFormData) => {
		try {
			let filePath: string | undefined

			if (data.sourceType === 'file' && data.file) {
				const uploadResult = await uploadApi.uploadDocument(data.file)
				filePath = uploadResult.file_path
			}

			const cardData: CardCreate = {
				name: data.name,
				description: data.description,
				topic_id: data.topicId,
				grade: parseGrade(data.classLevel),
				quarter: parseQuarter(data.term),
				url: data.sourceType === 'link' ? data.link : undefined,
				file_path: filePath,
				iframe: data.showAsIframe,
				window_id: data.windowId,
				subject_ids: data.subjectIds.length > 0 ? data.subjectIds : undefined,
				institution_type_ids:
					data.institutionTypeIds.length > 0
						? data.institutionTypeIds
						: undefined
			}

			console.log('➡️ Отправляемый payload:', cardData)

			await cardApi.createCard(cardData)
			toast.success('Материал сәтті сақталды!')
			handleClose()
		} catch {
			toast.error('Материалды сақтау кезінде қате орын алды')
		}
	})

	const selectedFile = watch('file')

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
		const file = e.dataTransfer.files[0]
		if (file) {
			handleFileChange(file)
		}
	}

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			handleFileChange(file)
		}
		e.target.value = ''
	}

	const handleRemoveFile = () => {
		handleFileChange(undefined)
	}

	return (
		<Modal
			open={isOpen}
			onClose={handleClose}
		>
			<div className={s.header}>
				<div className={s.headerIcon}>
					<BookMarked size={28} />
				</div>
				<div className={s.headerContent}>
					<h3 className={s.headerTitle}>Материал құру</h3>
					<p className={s.headerSubtitle}>Жаңа оқу материалын қосыңыз</p>
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
				<div className={clsx(s.row, s.inputsWrapper)}>
					<Input
						{...register('name')}
						label="Аты *"
						placeholder="Материалдың атауын жазыңыз"
						error={errors.name?.message}
					/>
					<div className={s.textareaWrapper}>
						<label className={s.textareaLabel}>Сипаттама</label>
						<textarea
							{...register('description')}
							placeholder="Материал туралы қысқаша сипаттама"
							className={clsx(s.textarea, errors.description && s.hasError)}
							maxLength={50}
						/>
						{errors.description && (
							<span className={s.error}>{errors.description.message}</span>
						)}
						<div className={s.charCount}>
							{watch('description')?.length ?? 0} / 50
						</div>
					</div>
				</div>

				<div className={s.row}>
					<div className={s.dropdownsGrid}>
						<div className={s.dropdownItem}>
							<span className={s.dropdownLabel}>
								<GraduationCap size={16} />
								Сынып/Курс
							</span>
							<Dropdown
								items={[...CLASS_OPTIONS]}
								value={watch('classLevel')}
								placeholder="Таңдаңыз"
								onChange={value =>
									setValue(
										'classLevel',
										value as (typeof CLASS_OPTIONS)[number]
									)
								}
							/>
						</div>
						<div className={s.dropdownItem}>
							<span className={s.dropdownLabel}>
								<Calendar size={16} />
								Тоқсан/Семестр
							</span>
							<Dropdown
								items={[...TERM_OPTIONS]}
								value={watch('term')}
								placeholder="Таңдаңыз"
								onChange={value =>
									setValue('term', value as (typeof TERM_OPTIONS)[number])
								}
							/>
						</div>
						<div className={s.dropdownItem}>
							<span className={s.dropdownLabel}>
								<LayoutGrid size={16} />
								Бөлім
							</span>
							<Dropdown
								items={windows.map(w => w.name)}
								value={windows.find(w => w.id === watch('windowId'))?.name}
								placeholder="Таңдаңыз"
								onChange={value => {
									const window = windows.find(w => w.name === value)
									setValue('windowId', window?.id)
								}}
							/>
						</div>
						<div className={s.dropdownItem}>
							<span className={s.dropdownLabel}>
								<BookMarked size={16} />
								Тақырып
							</span>
							<Dropdown
								items={topics.map(t => t.topic)}
								value={topics.find(t => t.id === watch('topicId'))?.topic}
								placeholder="Таңдаңыз"
								onChange={value => {
									const topic = topics.find(t => t.topic === value)
									setValue('topicId', topic?.id)
								}}
							/>
						</div>
					</div>
				</div>

				<div className={s.section}>
					<div className={s.sourceToggle}>
						<button
							type="button"
							className={clsx(
								s.sourceButton,
								sourceType === 'link' && s.active
							)}
							onClick={() => handleSourceTypeChange('link')}
						>
							Сілтеме
						</button>
						<button
							type="button"
							className={clsx(
								s.sourceButton,
								sourceType === 'file' && s.active
							)}
							onClick={() => handleSourceTypeChange('file')}
						>
							Файл
						</button>
					</div>

					{sourceType === 'link' ? (
						<div className={s.linkSection}>
							<Input
								{...register('link')}
								label="Сілтеме *"
								placeholder="https://example.com"
								error={errors.link?.message}
							/>
							<span className={s.sectionHint}>
								Материалға сілтемені енгізіңіз
							</span>
						</div>
					) : (
						<div className={s.fileUpload}>
							<input
								ref={fileInputRef}
								type="file"
								onChange={handleFileInputChange}
								style={{ display: 'none' }}
							/>

							{selectedFile ? (
								<div className={s.fileSelected}>
									<div className={s.fileSelectedIcon}>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
											<polyline points="14 2 14 8 20 8" />
										</svg>
									</div>
									<span className={s.fileName}>{selectedFile.name}</span>
									<button
										type="button"
										className={s.fileRemove}
										onClick={handleRemoveFile}
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<line
												x1="18"
												y1="6"
												x2="6"
												y2="18"
											/>
											<line
												x1="6"
												y1="6"
												x2="18"
												y2="18"
											/>
										</svg>
									</button>
								</div>
							) : (
								<div
									className={clsx(
										s.fileDropzone,
										isDragOver && s.dragOver,
										errors.file && s.hasError
									)}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
									onClick={() => fileInputRef.current?.click()}
								>
									<svg
										className={s.fileIcon}
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
										<polyline points="17 8 12 3 7 8" />
										<line
											x1="12"
											y1="3"
											x2="12"
											y2="15"
										/>
									</svg>
									<div className={s.fileText}>
										<span className={s.fileTitle}>
											Файлды осында сүйреңіз немесе таңдаңыз
										</span>
										<span className={s.fileHint}>
											Файлды жүктеу үшін басыңыз
										</span>
									</div>
								</div>
							)}
							{errors.file && (
								<span className={s.error}>{errors.file.message}</span>
							)}
						</div>
					)}
				</div>

				<div className={s.subjectsSection}>
					<div className={s.subjectsHeader}>
						<span className={s.sectionTitle}>Оқу орнының түрі</span>
						<span className={s.sectionHint}>Бірнеше түрді таңдауға болады</span>
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

				<div className={s.subjectsSection}>
					<div className={s.subjectsHeader}>
						<span className={s.sectionTitle}>Пәндер</span>
						<span className={s.sectionHint}>Бірнеше пәнді таңдауға болады</span>
					</div>

					<div className={s.subjectsGrid}>
						{subjects.map(subject => (
							<div
								key={subject.id}
								className={clsx(
									s.subjectItem,
									subjectIds.includes(subject.id) && s.selected
								)}
								onClick={() => handleSubjectToggle(subject.id)}
							>
								<input
									type="checkbox"
									className={s.subjectCheckbox}
									checked={subjectIds.includes(subject.id)}
									readOnly
								/>
								<span className={s.subjectName}>{subject.name}</span>
							</div>
						))}
					</div>
				</div>

				<div className={s.actions}>
					<Button
						type="submit"
						variant="primary"
						loading={isSubmitting}
					>
						Материал сақтау
					</Button>
				</div>
			</form>
		</Modal>
	)
}
