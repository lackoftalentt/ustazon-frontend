import { z } from 'zod';
import { MAX_FILE_SIZE, MAX_HOURS } from './types';

export const createKMZHSchema = z.object({
    subjectCode: z.string().min(1, 'Пәнді таңдаңыз'),
    classLevel: z.string().min(1, 'Сыныпты таңдаңыз'),
    quarter: z.string().min(1, 'Тоқсанды таңдаңыз'),
    hours: z.number()
        .min(1, 'Сағат саны кем дегенде 1 болуы керек')
        .max(MAX_HOURS, `Сағат саны ${MAX_HOURS}-дан аспауы керек`),
    lessonTopic: z.string().min(1, 'Сабақ тақырыбын енгізіңіз'),
    learningObjectives: z.string().min(1, 'Оқу мақсаттарын енгізіңіз'),
    files: z.array(z.instanceof(File))
        .refine(
            files => files.every(file => file.size <= MAX_FILE_SIZE),
            `Файл өлшемі ${MAX_FILE_SIZE / 1024 / 1024}MB-дан аспауы керек`
        )
});

export type CreateKMZHSchema = z.infer<typeof createKMZHSchema>;
