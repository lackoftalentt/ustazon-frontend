import { z } from 'zod';

export const resetPasswordSchema = z.object({
    phoneNumber: z
        .string()
        .min(1, 'Введите номер телефона')
        .regex(
            /^\+?7\d{10}$/,
            'Введите корректный номер телефона +7 (7XX) XXX-XX-XX'
        ),
    code: z.string().optional()
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
