import { qmjApi, type CreateQMJRequest } from '@/shared/api/qmjApi'
import { uploadApi } from '@/shared/api/uploadApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MAX_FILE_SIZE, MAX_HOURS } from './types'
import { createKMZHSchema, type CreateKMZHSchema } from './validation'

const parseGrade = (classLevel: string): number => {
	const match = classLevel.match(/(\d+)/)
	return match ? parseInt(match[1], 10) : 1
}

const parseQuarter = (quarter: string): number => {
	const match = quarter.match(/(\d+)/)
	return match ? parseInt(match[1], 10) : 1
}

interface UseCreateKMZHFormOptions {
	getSubjectIdByCode: (code: string) => number | undefined
}

export const useCreateKMZHForm = (
	onSubmitCallback: () => Promise<void>,
	options: UseCreateKMZHFormOptions
) => {
    const [files, setFiles] = useState<File[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<CreateKMZHSchema>({
        resolver: zodResolver(createKMZHSchema),
        defaultValues: {
            subjectCode: '',
            classLevel: '',
            quarter: '',
            hours: 1,
            lessonTopic: '',
            learningObjectives: '',
            files: [],
            institutionTypeIds: []
        }
    });

    const handleFilesChange = useCallback((newFiles: File[]) => {
        const validFiles = newFiles.filter(file => file.size <= MAX_FILE_SIZE);
        setFiles(validFiles);
        setValue('files', validFiles, { shouldValidate: true });
    }, [setValue]);

    const handleAddFiles = useCallback((addedFiles: File[]) => {
        const allFiles = [...files, ...addedFiles];
        handleFilesChange(allFiles);
    }, [files, handleFilesChange]);

    const handleRemoveFile = useCallback((index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        handleFilesChange(updatedFiles);
    }, [files, handleFilesChange]);

    const handleHoursChange = useCallback((value: number) => {
        const clampedValue = Math.max(1, Math.min(MAX_HOURS, value));
        setValue('hours', clampedValue, { shouldValidate: true });
    }, [setValue]);

    const handleInstitutionToggle = useCallback((institutionId: number) => {
        const current = watch('institutionTypeIds') || [];
        const updated = current.includes(institutionId)
            ? current.filter(id => id !== institutionId)
            : [...current, institutionId];
        setValue('institutionTypeIds', updated);
    }, [watch, setValue]);

    const institutionTypeIds = watch('institutionTypeIds') || [];

    const resetForm = useCallback(() => {
        reset();
        setFiles([]);
    }, [reset]);

    const onSubmit = handleSubmit(async (data) => {
        const subjectId = options.getSubjectIdByCode(data.subjectCode)

        let mainFileUrl: string | undefined
        if (data.files.length > 0) {
            const uploadResult = await uploadApi.uploadDocument(data.files[0])
            mainFileUrl = uploadResult.file_path
        }

        const requestData: CreateQMJRequest = {
            grade: parseGrade(data.classLevel),
            quarter: parseQuarter(data.quarter),
            code: data.subjectCode,
            title: data.lessonTopic,
            text: data.learningObjectives,
            hour: data.hours,
            order: 1,
            subject_ids: subjectId ? [subjectId] : [],
            institution_type_ids: data.institutionTypeIds
        }

        if (mainFileUrl) {
            requestData.file = mainFileUrl
        }

        console.log('➡️ QMJ payload:', JSON.stringify(requestData, null, 2))
        const createdQMJ = await qmjApi.createQMJ(requestData)

        if (data.files.length > 1) {
            for (let i = 1; i < data.files.length; i++) {
                const file = data.files[i]
                await qmjApi.addFileToQMJ(createdQMJ.id, {
                    file: file
                })
            }
        }

        await onSubmitCallback()
    });

    return {
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
    };
};
