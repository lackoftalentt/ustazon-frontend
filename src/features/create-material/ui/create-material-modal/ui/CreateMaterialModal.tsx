import logo from '@/shared/assets/images/logo.png'
import { Button } from '@/shared/ui/button'
import { Dropdown } from '@/shared/ui/dropdown'
import { Input } from '@/shared/ui/input'
import { Modal } from '@/shared/ui/modal'
import { clsx } from 'clsx'
import { BookMarked, Calendar, GraduationCap } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
	CLASS_OPTIONS,
	SUBJECT_OPTIONS,
	TERM_OPTIONS,
	type CreateMaterialFormData,
	type SubjectOption
} from '../../../model/types'
import { useCreateMaterialForm } from '../../../model/useCreateMaterialForm'
import { useCreateMaterialStore } from '../../../model/useCreateMaterialStore'
import s from './CreateMaterialModal.module.scss'

export const CreateMaterialModal = () => {
	const { isOpen, closeModal } = useCreateMaterialStore()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragOver, setIsDragOver] = useState(false)

	const {
		register,
		setValue,
		watch,
		formState: { errors, isSubmitting },
		sourceType,
		subjects,
		handleSourceTypeChange,
		handleFileChange,
		handleSubjectToggle,
		resetForm,
		onSubmit
	} = useCreateMaterialForm(async (data: CreateMaterialFormData) => {
		try {
			// TODO: API call to save material
			console.log('Saving material:', data)
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
				<div className={s.row}>
					<Input
						{...register('name')}
						label="Аты *"
						placeholder="Материалдың атауын жазыңыз"
						error={errors.name?.message}
					/>
					<Input
						{...register('topic')}
						label="Тақырып"
						placeholder="Тақырып атауын жазыңыз"
					/>
				</div>

				<div className={s.row}>
					<div className={s.dropdownWrapper}>
						<span className={s.dropdownLabel}>
							<GraduationCap size={16} />
							Сынып/Курс
						</span>
						<Dropdown
							items={[...CLASS_OPTIONS]}
							value={watch('classLevel')}
							placeholder="Таңдаңыз"
							onChange={value =>
								setValue('classLevel', value as (typeof CLASS_OPTIONS)[number])
							}
						/>
					</div>
					<div className={s.dropdownWrapper}>
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

							{/* <label className={s.iframeToggle}>
                                <input
                                    type="checkbox"
                                    id="showAsIframe"
                                    className={s.checkbox}
                                    {...register('showAsIframe')}
                                />
                                <span className={s.checkboxLabel}>
                                    Iframe ретінде көрсету
                                </span>
                            </label> */}
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
						{' '}
						<span className={s.sectionTitle}>Пән карточкасы</span>
						<span className={s.sectionHint}>Бірнеше пәнді таңдауға болады</span>
					</div>

					<div className={s.subjectsGrid}>
						{SUBJECT_OPTIONS.map(subject => (
							<div
								key={subject}
								className={clsx(
									s.subjectItem,
									subjects.includes(subject as SubjectOption) && s.selected
								)}
								onClick={() => handleSubjectToggle(subject as SubjectOption)}
							>
								<input
									type="checkbox"
									className={s.subjectCheckbox}
									checked={subjects.includes(subject as SubjectOption)}
									readOnly
								/>
								<span className={s.subjectName}>{subject}</span>
							</div>
						))}
					</div>
				</div>

				<div className={s.actions}>
					{/* <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}>
                        Артқа
                    </Button> */}
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
