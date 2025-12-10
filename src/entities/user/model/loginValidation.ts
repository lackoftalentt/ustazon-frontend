import { z } from 'zod';

const passwordRegex = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/
};

export const loginSchema = z
    .object({
        iin: z
            .string()
            .length(12, 'ИИН должен содержать 12 цифр')
            .regex(/^\d{12}$/, 'ИИН содержит только цифры'),
        password: z.string()
    })
    .superRefine((data, ctx) => {
        if (!data.password) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Введите пароль',
                path: ['password']
            });
        } else {
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
    });

export type LoginFormData = z.infer<typeof loginSchema>;
