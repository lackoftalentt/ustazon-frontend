import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    resetPasswordSchema,
    type ResetPasswordFormData
} from '@/entities/user';
import { formatPhoneNumber } from '../lib/formatters';

export const useResetPasswordForm = (
    onSubmit: (data: ResetPasswordFormData) => void
) => {
    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        form.setValue('phoneNumber', formatted, {
            shouldValidate: form.formState.isSubmitted
        });
    };

    return {
        ...form,
        handlePhoneChange,
        onSubmit: form.handleSubmit(onSubmit)
    };
};
