export type SourceType = 'link' | 'file';

export type ClassOption =
    | '1 сынып' | '2 сынып' | '3 сынып' | '4 сынып'
    | '5 сынып' | '6 сынып' | '7 сынып' | '8 сынып'
    | '9 сынып' | '10 сынып' | '11 сынып' | '12 сынып'
    | '1 курс' | '2 курс' | '3 курс' | '4 курс' | '5 курс';

export type TermOption =
    | '1 тоқсан' | '2 тоқсан' | '3 тоқсан' | '4 тоқсан'
    | '1 семестр' | '2 семестр' | '3 семестр';

export const CLASS_OPTIONS: ClassOption[] = [
    '1 сынып', '2 сынып', '3 сынып', '4 сынып',
    '5 сынып', '6 сынып', '7 сынып', '8 сынып',
    '9 сынып', '10 сынып', '11 сынып', '12 сынып',
    '1 курс', '2 курс', '3 курс', '4 курс', '5 курс'
];

export const TERM_OPTIONS: TermOption[] = [
    '1 тоқсан', '2 тоқсан', '3 тоқсан', '4 тоқсан',
    '1 семестр', '2 семестр', '3 семестр'
];

export const SUBJECT_OPTIONS = [
    'Алгебра',
    'Геометрия',
    'Бастауыш',
    'Қазақ тілі',
    'Қазақ әдебиеті',
    'Қазақстан тарих',
    'Дүниежүзі тарих',
    'Әліппе',
    'Ана тілі',
    'Дүниетану',
    'Жаратылыстану',
    'Бейнелеу',
    'География',
    'Биология',
    'Информатика',
    'Физика',
    'Химия',
    'Орыс тілі',
    'Ағылшын тілі',
    'Еңбек',
    'Балабақша',
    'Дене шынықтыру'
] as const;

export type SubjectOption = typeof SUBJECT_OPTIONS[number];

export interface CreateMaterialFormData {
    name: string;
    topic?: string;
    classLevel?: ClassOption;
    term?: TermOption;
    sourceType: SourceType;
    link?: string;
    file?: File;
    showAsIframe: boolean;
    subjects: SubjectOption[];
}
