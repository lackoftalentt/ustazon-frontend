import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/entities/user';
import { formatNumericInput } from '../lib/formatters';

export const useLoginForm = (onSubmit: (data: LoginFormData) => void) => {
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });

    const handleIinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumericInput(e.target.value, 12);
        form.setValue('iin', formatted, {
            shouldValidate: form.formState.isSubmitted
        });
    };

    return { ...form, handleIinChange, onSubmit: form.handleSubmit(onSubmit) };
};
