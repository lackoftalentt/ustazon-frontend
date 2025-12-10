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
        password: z.string().optional(),
        confirmPassword: z.string().optional()
    })
    .superRefine((data, ctx) => {
        if (data.password) {
            if (data.password.length < 8) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Пароль должен содержать минимум 8 символов',
                    path: ['password']
                });
            }
            if (!passwordRegex.uppercase.test(data.password)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'Пароль должен содержать хотя бы одну заглавную букву',
                    path: ['password']
                });
            }
            if (!passwordRegex.lowercase.test(data.password)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'Пароль должен содержать хотя бы одну строчную букву',
                    path: ['password']
                });
            }
            if (!passwordRegex.number.test(data.password)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Пароль должен содержать хотя бы одну цифру',
                    path: ['password']
                });
            }
        }

        if (data.password && data.confirmPassword) {
            if (data.password !== data.confirmPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Пароли не совпадают',
                    path: ['confirmPassword']
                });
            }
        }

        if (data.password && !data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Подтвердите пароль',
                path: ['confirmPassword']
            });
        }
    });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
