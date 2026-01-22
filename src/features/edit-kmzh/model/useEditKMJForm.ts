import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { editKMJSchema, type EditKMJSchema } from './validation'
import type { EditKMJFormData, KMJData, ExistingFile } from './types'

export const useEditKMJForm = (
	kmjData: KMJData | null,
	onSubmit: (data: EditKMJFormData) => void
) => {
	const [filesToDelete, setFilesToDelete] = useState<string[]>([])

	const form = useForm<EditKMJSchema>({
		resolver: zodResolver(editKMJSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			classLevel: '5-сынып',
			quarter: '1 тоқсан',
			subjectCode: '',
			hours: 1,
			lessonTopic: '',
			learningObjectives: '',
			existingAdditionalFiles: [],
			subjects: [],
			institutionType: 'Мектеп'
		}
	})

	useEffect(() => {
		if (kmjData) {
			form.reset({
				classLevel: kmjData.classLevel,
				quarter: kmjData.quarter,
				subjectCode: kmjData.subjectCode,
				hours: kmjData.hours,
				lessonTopic: kmjData.lessonTopic,
				learningObjectives: kmjData.learningObjectives,
				existingAdditionalFiles: kmjData.existingAdditionalFiles,
				subjects: kmjData.subjects,
				institutionType: kmjData.institutionType
			})
			setFilesToDelete([])
		}
	}, [kmjData, form])

	const subjects = form.watch('subjects') || []
	const existingFiles = form.watch('existingAdditionalFiles') || []

	const handleSubjectToggle = (subject: string) => {
		const current = form.getValues('subjects') || []
		const updated = current.includes(subject)
			? current.filter(s => s !== subject)
			: [...current, subject]
		form.setValue('subjects', updated, {
			shouldValidate: form.formState.isSubmitted
		})
	}

	const handleMainFileChange = (file: File | undefined) => {
		form.setValue('mainFile', file, {
			shouldValidate: form.formState.isSubmitted
		})
	}

	const handleAdditionalFilesChange = (files: File[]) => {
		form.setValue('additionalFiles', files, {
			shouldValidate: form.formState.isSubmitted
		})
	}

	const handleRemoveExistingFile = (fileId: string) => {
		const current = form.getValues('existingAdditionalFiles') || []
		form.setValue(
			'existingAdditionalFiles',
			current.filter(f => f.id !== fileId)
		)
		setFilesToDelete(prev => [...prev, fileId])
	}

	const handleHoursChange = (value: number) => {
		const clamped = Math.min(10, Math.max(1, value))
		form.setValue('hours', clamped, {
			shouldValidate: form.formState.isSubmitted
		})
	}

	const resetForm = () => {
		form.reset()
		setFilesToDelete([])
	}

	return {
		...form,
		subjects,
		existingFiles,
		filesToDelete,
		handleSubjectToggle,
		handleMainFileChange,
		handleAdditionalFilesChange,
		handleRemoveExistingFile,
		handleHoursChange,
		resetForm,
		onSubmit: form.handleSubmit(onSubmit)
	}
}
