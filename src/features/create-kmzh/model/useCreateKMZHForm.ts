import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback } from 'react';
import { createKMZHSchema, type CreateKMZHSchema } from './validation';
import { type CreateKMZHFormData, MAX_FILE_SIZE, MAX_HOURS } from './types';

export const useCreateKMZHForm = (onSubmitCallback: (data: CreateKMZHFormData) => Promise<void>) => {
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
            files: []
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

    const resetForm = useCallback(() => {
        reset();
        setFiles([]);
    }, [reset]);

    const onSubmit = handleSubmit(async (data) => {
        const formData: CreateKMZHFormData = {
            subjectCode: data.subjectCode,
            classLevel: data.classLevel,
            quarter: data.quarter,
            hours: data.hours,
            lessonTopic: data.lessonTopic,
            learningObjectives: data.learningObjectives,
            files: data.files
        };
        await onSubmitCallback(formData);
    });

    return {
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
    };
};
