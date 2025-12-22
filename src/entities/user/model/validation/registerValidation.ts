import { z } from 'zod';

const passwordRegex = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/
};

export const registerSchema = z
    .object({
        iin: z
            .string()
            .length(12, 'ИИН должен содержать 12 цифр')
            .regex(/^\d{12}$/, 'ИИН содержит только цифры'),
        name: z
            .string()
            .min(2, 'Имя должно содержать минимум 2 символа')
            .max(50, 'Имя слишком длинное')
            .regex(
                /^[А-Яа-яЁёA-Za-z\s-]+$/,
                'Имя содержит недопустимые символы'
            ),
        password: z.string(),
        confirmPassword: z.string(),
        phoneNumber: z
            .string()
            .min(1, 'Введите номер телефона')
            .regex(/^\+?7\d{10}$/, 'Введите корректный номер телефона')
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
        } else {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Введите пароль',
                path: ['password']
            });
        }

        if (!data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Подтвердите пароль',
                path: ['confirmPassword']
            });
        } else if (data.confirmPassword.length < 8) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Пароль должен содержать минимум 8 символов',
                path: ['confirmPassword']
            });
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
    });

export type RegisterFormData = z.infer<typeof registerSchema>;
