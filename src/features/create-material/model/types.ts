export type SourceType = 'link' | 'file'

export type ClassOption =
	| '1 сынып'
	| '2 сынып'
	| '3 сынып'
	| '4 сынып'
	| '5 сынып'
	| '6 сынып'
	| '7 сынып'
	| '8 сынып'
	| '9 сынып'
	| '10 сынып'
	| '11 сынып'
	| '12 сынып'
	| '1 курс'
	| '2 курс'
	| '3 курс'
	| '4 курс'
	| '5 курс'

export type TermOption =
	| '1 тоқсан'
	| '2 тоқсан'
	| '3 тоқсан'
	| '4 тоқсан'
	| '1 семестр'
	| '2 семестр'
	| '3 семестр'

export const CLASS_OPTIONS: ClassOption[] = [
	'1 сынып',
	'2 сынып',
	'3 сынып',
	'4 сынып',
	'5 сынып',
	'6 сынып',
	'7 сынып',
	'8 сынып',
	'9 сынып',
	'10 сынып',
	'11 сынып',
	'12 сынып',
	'1 курс',
	'2 курс',
	'3 курс',
	'4 курс',
	'5 курс'
]

export const TERM_OPTIONS: TermOption[] = [
	'1 тоқсан',
	'2 тоқсан',
	'3 тоқсан',
	'4 тоқсан',
	'1 семестр',
	'2 семестр',
	'3 семестр'
]

export interface CreateMaterialFormData {
	name: string
	description?: string
	topicId?: number
	classLevel?: ClassOption
	term?: TermOption
	institutionTypeIds: number[]
	windowId?: number
	sourceType: SourceType
	link?: string
	file?: File
	showAsIframe: boolean
	subjectIds: number[]
}
