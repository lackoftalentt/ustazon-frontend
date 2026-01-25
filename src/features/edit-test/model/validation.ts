import { z } from 'zod';
import { MIN_DURATION, MAX_DURATION } from './types';

const answerSchema = z.object({
    id: z.number(),
    localId: z.string(),
    text: z.string(),
    isCorrect: z.boolean(),
    order: z.number()
});

const questionSchema = z.object({
    id: z.number(),
    localId: z.string(),
    text: z.string().min(1, 'Сұрақ мәтіні қажет'),
    photo: z.string().optional(),
    newImage: z.instanceof(File).optional(),
    order: z.number(),
    answers: z.array(answerSchema).min(2, 'Кемінде 2 жауап нұсқасы қажет')
});

export const editTestSchema = z.object({
    title: z
        .string()
        .min(3, 'Тест атауы кемінде 3 таңбадан тұруы керек')
        .max(200, 'Тест атауы 200 таңбадан аспауы керек'),
    subject: z
        .string()
        .min(1, 'Пәнді таңдаңыз'),
    duration: z
        .number()
        .min(MIN_DURATION, `Ұзақтығы кемінде ${MIN_DURATION} минут болуы керек`)
        .max(MAX_DURATION, `Ұзақтығы ${MAX_DURATION} минуттан аспауы керек`),
    difficulty: z.enum(['easy', 'medium', 'hard'], {
        message: 'Қиындық деңгейін таңдаңыз'
    }),
    questions: z.array(questionSchema).min(1, 'Кемінде 1 сұрақ қажет')
});

export type EditTestSchema = z.infer<typeof editTestSchema>;
