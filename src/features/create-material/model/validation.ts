import { z } from 'zod';
import { CLASS_OPTIONS, TERM_OPTIONS, SUBJECT_OPTIONS } from './types';

const urlRegex = /^https?:\/\/.+/;

export const createMaterialSchema = z
    .object({
        name: z.string().min(1, 'Материалдың атауын енгізіңіз'),
        topic: z.string().optional(),
        classLevel: z.enum(CLASS_OPTIONS as unknown as [string, ...string[]]).optional(),
        term: z.enum(TERM_OPTIONS as unknown as [string, ...string[]]).optional(),
        sourceType: z.enum(['link', 'file']),
        link: z.string().optional(),
        file: z.instanceof(File).optional(),
        showAsIframe: z.boolean(),
        subjects: z.array(z.enum(SUBJECT_OPTIONS as unknown as [string, ...string[]]))
    })
    .superRefine((data, ctx) => {
        if (data.sourceType === 'link') {
            if (!data.link) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Сілтемені енгізіңіз',
                    path: ['link']
                });
            } else if (!urlRegex.test(data.link)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Дұрыс URL форматын енгізіңіз (https://...)',
                    path: ['link']
                });
            }
        }

        if (data.sourceType === 'file' && !data.file) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Файлды таңдаңыз',
                path: ['file']
            });
        }
    });

export type CreateMaterialSchema = z.infer<typeof createMaterialSchema>;
