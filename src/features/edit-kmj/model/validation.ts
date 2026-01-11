import { z } from 'zod';
import { CLASS_LEVELS, QUARTERS, SUBJECTS, INSTITUTION_TYPES, SUBJECT_CODES } from './types';

export const editKMJSchema = z.object({
    // Негізгі ақпарат
    classLevel: z.enum(CLASS_LEVELS as unknown as [string, ...string[]], {
        required_error: 'Сыныпты таңдаңыз'
    }),
    quarter: z.enum(QUARTERS as unknown as [string, ...string[]], {
        required_error: 'Тоқсанды таңдаңыз'
    }),
    subjectCode: z.enum(SUBJECT_CODES as unknown as [string, ...string[]], {
        required_error: 'Пән кодын таңдаңыз'
    }),
    hours: z.number()
        .min(1, 'Сағат саны 1-ден кем болмауы керек')
        .max(10, 'Сағат саны 10-нан аспауы керек'),

    // Сабақ мазмұны
    lessonTopic: z.string().min(1, 'Сабақ тақырыбын енгізіңіз'),
    learningObjectives: z.string().min(1, 'Оқу мақсаттарын енгізіңіз'),

    // Файлдар (optional - may keep existing)
    mainFile: z.instanceof(File).optional(),
    additionalFiles: z.array(z.instanceof(File)).optional(),
    existingAdditionalFiles: z.array(z.object({
        id: z.string(),
        name: z.string(),
        size: z.string(),
        path: z.string()
    })),

    // Санаттар
    subjects: z.array(z.enum(SUBJECTS as unknown as [string, ...string[]]))
        .min(1, 'Кем дегенде бір пән таңдаңыз'),
    institutionType: z.enum(INSTITUTION_TYPES as unknown as [string, ...string[]], {
        required_error: 'Оқу орнының түрін таңдаңыз'
    })
});

export type EditKMJSchema = z.infer<typeof editKMJSchema>;
