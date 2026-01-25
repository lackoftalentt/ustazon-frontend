import { z } from 'zod';
import { MAX_DURATION, MIN_ANSWERS, MIN_DURATION, MIN_QUESTIONS } from './types';

const answerSchema = z.object({
    id: z.string(),
    text: z.string(),
    isCorrect: z.boolean()
});

const questionSchema = z.object({
    id: z.string(),
    text: z.string().min(1, 'Сұрақ мәтінін енгізіңіз'),
    image: z.instanceof(File).optional(),
    answers: z.array(answerSchema)
        .min(MIN_ANSWERS, `Кем дегенде ${MIN_ANSWERS} жауап болуы керек`)
        .refine(
            answers => answers.filter(a => a.text.trim()).length >= MIN_ANSWERS,
            `Кем дегенде ${MIN_ANSWERS} жауап мәтіні толтырылуы керек`
        )
        .refine(
            answers => answers.some(a => a.isCorrect),
            'Дұрыс жауапты белгілеңіз'
        )
});

export const createTestSchema = z.object({
    subjectCode: z.string().min(1, 'Пәнді таңдаңыз'),
    name: z.string().min(1, 'Тест атауын енгізіңіз'),
    duration: z.number()
        .min(MIN_DURATION, `Ең аз уақыт: ${MIN_DURATION} минут`)
        .max(MAX_DURATION, `Ең көп уақыт: ${MAX_DURATION} минут`),
    difficulty: z.enum(['easy', 'medium', 'hard'], {
        message: 'Күрделілік деңгейін таңдаңыз'
    }),
    questions: z.array(questionSchema)
        .min(MIN_QUESTIONS, `Кем дегенде ${MIN_QUESTIONS} сұрақ қосыңыз`)
});

export type CreateTestSchemaType = z.infer<typeof createTestSchema>;
