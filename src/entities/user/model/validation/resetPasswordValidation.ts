import { z } from 'zod';

const passwordRegex = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/
};

export const resetPasswordSchema = z
    .object({
        phoneNumber: z
            .string()
            .min(1, 'Введите номер телефона')
            .regex(
                /^\+?7\d{10}$/,
                'Введите корректный номер телефона +7 (7XX) XXX-XX-XX'
            ),
        code: z.string().optional(),
        newPassword: z.string().optional(),
        confirmPassword: z.string().optional()
    })
    .superRefine((data, ctx) => {
        if (data.newPassword) {
            if (data.newPassword.length < 8) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Пароль должен содержать минимум 8 символов',
                    path: ['newPassword']
                });
            }
            if (!passwordRegex.uppercase.test(data.newPassword)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'Пароль должен содержать хотя бы одну заглавную букву',
                    path: ['newPassword']
                });
            }
            if (!passwordRegex.lowercase.test(data.newPassword)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'Пароль должен содержать хотя бы одну строчную букву',
                    path: ['newPassword']
                });
            }
            if (!passwordRegex.number.test(data.newPassword)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Пароль должен содержать хотя бы одну цифру',
                    path: ['newPassword']
                });
            }
        }

        if (data.newPassword && data.confirmPassword) {
            if (data.newPassword !== data.confirmPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Пароли не совпадают',
                    path: ['confirmPassword']
                });
            }
        }

        if (data.newPassword && !data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Подтвердите пароль',
                path: ['confirmPassword']
            });
        }
    });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
