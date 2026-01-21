import { z } from 'zod'

export const editKMJSchema = z.object({
	classLevel: z.string().min(1, 'Сыныпты таңдаңыз'),
	quarter: z.string().min(1, 'Тоқсанды таңдаңыз'),
	subjectCode: z.string().min(1, 'Пән кодын таңдаңыз'),
	hours: z
		.number()
		.min(1, 'Сағат саны 1-ден кем болмауы керек')
		.max(10, 'Сағат саны 10-нан аспауы керек'),

	lessonTopic: z.string().min(1, 'Сабақ тақырыбын енгізіңіз'),
	learningObjectives: z.string().min(1, 'Оқу мақсаттарын енгізіңіз'),

	mainFile: z.instanceof(File).optional(),
	additionalFiles: z.array(z.instanceof(File)).optional(),
	existingAdditionalFiles: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			size: z.string(),
			path: z.string()
		})
	),

	subjects: z.array(z.string()).min(1, 'Кем дегенде бір пән таңдаңыз'),
	institutionType: z.string().min(1, 'Оқу орнының түрін таңдаңыз')
})

export type EditKMJSchema = z.infer<typeof editKMJSchema>
