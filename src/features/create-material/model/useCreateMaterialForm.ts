import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { CreateMaterialFormData, SourceType } from './types'
import { createMaterialSchema } from './validation'

export const useCreateMaterialForm = (
	onSubmit: (data: CreateMaterialFormData) => void
) => {
	const form = useForm<CreateMaterialFormData>({
		resolver: zodResolver(createMaterialSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		defaultValues: {
			name: '',
			topicId: undefined,
			sourceType: 'link',
			link: '',
			showAsIframe: false,
			subjectIds: [],
			institutionTypeIds: []
		}
	})

	const sourceType = form.watch('sourceType')
	const subjectIds = form.watch('subjectIds') || []
	const institutionTypeIds = form.watch('institutionTypeIds') || []

	const handleSourceTypeChange = (type: SourceType) => {
		form.setValue('sourceType', type)
		if (type === 'link') {
			form.setValue('file', undefined)
		} else {
			form.setValue('link', '')
		}
		form.clearErrors(['link', 'file'])
	}

	const handleFileChange = (file: File | undefined) => {
		form.setValue('file', file, { shouldValidate: form.formState.isSubmitted })
	}

	const handleSubjectToggle = (subjectId: number) => {
		const current = form.getValues('subjectIds') || []
		const updated = current.includes(subjectId)
			? current.filter(id => id !== subjectId)
			: [...current, subjectId]
		form.setValue('subjectIds', updated)
	}

	const handleInstitutionToggle = (institutionId: number) => {
		const current = form.getValues('institutionTypeIds') || []
		const updated = current.includes(institutionId)
			? current.filter(id => id !== institutionId)
			: [...current, institutionId]
		form.setValue('institutionTypeIds', updated)
	}

	const resetForm = () => {
		form.reset({
			name: '',
			topicId: undefined,
			sourceType: 'link',
			link: '',
			showAsIframe: false,
			subjectIds: [],
			institutionTypeIds: []
		})
	}

	return {
		...form,
		sourceType,
		subjectIds,
		institutionTypeIds,
		handleSourceTypeChange,
		handleFileChange,
		handleSubjectToggle,
		handleInstitutionToggle,
		resetForm,
		onSubmit: form.handleSubmit(onSubmit)
	}
}
