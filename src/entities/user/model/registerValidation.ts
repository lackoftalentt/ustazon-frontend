import { z } from 'zod';

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
        password: z
            .string()
            .min(8, 'Пароль должен содержать минимум 8 символов')
            .regex(
                /[A-Z]/,
                'Пароль должен содержать хотя бы одну заглавную букву'
            )
            .regex(
                /[a-z]/,
                'Пароль должен содержать хотя бы одну строчную букву'
            )
            .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
        passwordConfirm: z.string().min(8, 'Подтвердите пароль'),
        phoneNumber: z
            .string()
            .min(1, 'Введите номер телефона')
            .regex(/^\+?7\d{10}$/, 'Введите корректный номер телефона')
    })
    .refine(data => data.password === data.passwordConfirm, {
        message: 'Пароли не совпадают',
        path: ['passwordConfirm']
    });

export type RegisterFormData = z.infer<typeof registerSchema>;
