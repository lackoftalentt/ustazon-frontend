import { z } from 'zod';

const urlRegex = /^https?:\/\/.+/;

export const createMaterialSchema = z
    .object({
        name: z.string().min(1, 'Материалдың атауын енгізіңіз'),
        topic: z.string().optional(),
        classLevel: z.string().optional(),
        term: z.string().optional(),
        sourceType: z.enum(['link', 'file']),
        link: z.string().optional(),
        file: z.instanceof(File).optional(),
        showAsIframe: z.boolean(),
        subjects: z.array(z.string())
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
