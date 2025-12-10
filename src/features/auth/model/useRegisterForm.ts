import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/entities/user';
import { formatNumericInput, formatPhoneNumber } from '../lib/formatters';

export const useRegisterForm = (onSubmit: (data: RegisterFormData) => void) => {
    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    });

    const handleIinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumericInput(e.target.value, 12);
        form.setValue('iin', formatted, {
            shouldValidate: form.formState.isSubmitted
        });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        form.setValue('phoneNumber', formatted, {
            shouldValidate: form.formState.isSubmitted
        });
    };

    return {
        ...form,
        handleIinChange,
        handlePhoneChange,
        onSubmit: form.handleSubmit(onSubmit)
    };
};
