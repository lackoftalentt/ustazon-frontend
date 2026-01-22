import { z } from 'zod'
import { CLASS_OPTIONS, TERM_OPTIONS } from './types'

const urlRegex = /^https?:\/\/.+/

export const createMaterialSchema = z
	.object({
		name: z.string().min(1),
		description: z
			.string()
			.max(50, { message: 'Сипаттама 50 таңбадан аспауы тиіс' })
			.optional(),
		topicId: z.number().optional(),
		classLevel: z.enum(CLASS_OPTIONS).optional(),
		term: z.enum(TERM_OPTIONS).optional(),
		institutionTypeIds: z.array(z.number()),
		windowId: z.number().optional(),
		sourceType: z.enum(['link', 'file']),
		link: z.string().optional(),
		file: z.instanceof(File).optional(),
		showAsIframe: z.boolean(),
		subjectIds: z.array(z.number())
	})
	.superRefine((data, ctx) => {
		if (data.sourceType === 'link') {
			if (!data.link) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Сілтемені енгізіңіз',
					path: ['link']
				})
			} else if (!urlRegex.test(data.link)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Дұрыс URL форматын енгізіңіз (https://...)',
					path: ['link']
				})
			}
		}

		if (data.sourceType === 'file' && !data.file) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Файлды таңдаңыз',
				path: ['file']
			})
		}
	})

export type CreateMaterialSchema = z.infer<typeof createMaterialSchema>
