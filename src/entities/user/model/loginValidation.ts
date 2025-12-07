import { z } from 'zod';

export const loginSchema = z.object({
    iin: z
        .string()
        .length(12, 'ИИН должен содержать 12 цифр')
        .regex(/^\d{12}$/, 'ИИН содержит только цифры'),
    password: z.string().min(8, 'Пароль должен содержать минимум 8 символов')
});

export type LoginFormData = z.infer<typeof loginSchema>;
