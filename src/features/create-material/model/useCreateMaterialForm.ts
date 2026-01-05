import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMaterialSchema, type CreateMaterialSchema } from './validation';
import type { CreateMaterialFormData, SourceType, SubjectOption } from './types';

export const useCreateMaterialForm = (onSubmit: (data: CreateMaterialFormData) => void) => {
    const form = useForm<CreateMaterialSchema>({
        resolver: zodResolver(createMaterialSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            topic: '',
            sourceType: 'link',
            link: '',
            showAsIframe: false,
            subjects: []
        }
    });

    const sourceType = form.watch('sourceType');
    const subjects = form.watch('subjects') || [];

    const handleSourceTypeChange = (type: SourceType) => {
        form.setValue('sourceType', type);
        if (type === 'link') {
            form.setValue('file', undefined);
        } else {
            form.setValue('link', '');
        }
        form.clearErrors(['link', 'file']);
    };

    const handleFileChange = (file: File | undefined) => {
        form.setValue('file', file, { shouldValidate: form.formState.isSubmitted });
    };

    const handleSubjectToggle = (subject: SubjectOption) => {
        const current = form.getValues('subjects') || [];
        const updated = current.includes(subject)
            ? current.filter(s => s !== subject)
            : [...current, subject];
        form.setValue('subjects', updated as SubjectOption[]);
    };

    const resetForm = () => {
        form.reset({
            name: '',
            topic: '',
            sourceType: 'link',
            link: '',
            showAsIframe: false,
            subjects: []
        });
    };

    return {
        ...form,
        sourceType,
        subjects,
        handleSourceTypeChange,
        handleFileChange,
        handleSubjectToggle,
        resetForm,
        onSubmit: form.handleSubmit(onSubmit)
    };
};
