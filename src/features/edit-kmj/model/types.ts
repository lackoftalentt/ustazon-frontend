export type ClassLevel =
    | '1-сынып' | '2-сынып' | '3-сынып' | '4-сынып'
    | '5-сынып' | '6-сынып' | '7-сынып' | '8-сынып'
    | '9-сынып' | '10-сынып' | '11-сынып' | '12-сынып';

export type Quarter = '1 тоқсан' | '2 тоқсан' | '3 тоқсан' | '4 тоқсан';

export type SubjectCode =
    | 'Бастауыш'
    | 'Ана тілі'
    | 'Әліппе'
    | 'Дүниетану'
    | 'Жаратылыстану'
    | 'Бейнелеу'
    | 'Қазақ әдебиеті ЖМБ'
    | 'Қазақ әдебиеті'
    | 'Қазақ әдебиеті Гуманитарлық'
    | 'Қазақстан тарих'
    | 'Дүниежүзі тарих'
    | 'География'
    | 'Биология'
    | 'Информатика'
    | 'Физика'
    | 'Химия'
    | 'Орыс тілі'
    | 'Ағылшын тілі'
    | 'English Plus'
    | 'Еңбек'
    | 'Балабақша'
    | 'Дене шынықтыру'
    | 'Алгебра ЖМБ'
    | 'Геометрия ЖМБ'
    | 'Алгебра Гуманитарлық'
    | 'Геометрия Гуманитарлық'
    | 'Қазақ тілі ЖМБ'
    | 'Қазақ тілі'
    | 'Қазақ тілі Гуманитарлық';

export type Subject =
    | 'Python'
    | 'Ағылшын тілі'
    | 'Балабақша'
    | 'Бастауыш'
    | 'Биология'
    | 'География'
    | 'Геометрия'
    | 'Дене шынықтыру'
    | 'Дүниежүзі тарих'
    | 'Еңбек'
    | 'Информатика'
    | 'Математика'
    | 'Орыс тілі'
    | 'Тарих'
    | 'Физика'
    | 'Химия'
    | 'Қазақ тілі'
    | 'Қазақ тілі | әдебиеті'
    | 'Қазақ әдебиеті'
    | 'Қазақстан тарихы';

export type InstitutionType =
    | 'Python тілін үйрену'
    | 'Балабақша'
    | 'Колледж'
    | 'Мектеп'
    | 'Университет';

export const CLASS_LEVELS: ClassLevel[] = [
    '1-сынып', '2-сынып', '3-сынып', '4-сынып',
    '5-сынып', '6-сынып', '7-сынып', '8-сынып',
    '9-сынып', '10-сынып', '11-сынып', '12-сынып'
];

export const QUARTERS: Quarter[] = [
    '1 тоқсан', '2 тоқсан', '3 тоқсан', '4 тоқсан'
];

export const SUBJECTS: Subject[] = [
    'Python',
    'Ағылшын тілі',
    'Балабақша',
    'Бастауыш',
    'Биология',
    'География',
    'Геометрия',
    'Дене шынықтыру',
    'Дүниежүзі тарих',
    'Еңбек',
    'Информатика',
    'Математика',
    'Орыс тілі',
    'Тарих',
    'Физика',
    'Химия',
    'Қазақ тілі',
    'Қазақ тілі | әдебиеті',
    'Қазақ әдебиеті',
    'Қазақстан тарихы'
];

export const INSTITUTION_TYPES: InstitutionType[] = [
    'Python тілін үйрену',
    'Балабақша',
    'Колледж',
    'Мектеп',
    'Университет'
];

export const SUBJECT_CODES: SubjectCode[] = [
    'Бастауыш',
    'Ана тілі',
    'Әліппе',
    'Дүниетану',
    'Жаратылыстану',
    'Бейнелеу',
    'Қазақ әдебиеті ЖМБ',
    'Қазақ әдебиеті',
    'Қазақ әдебиеті Гуманитарлық',
    'Қазақстан тарих',
    'Дүниежүзі тарих',
    'География',
    'Биология',
    'Информатика',
    'Физика',
    'Химия',
    'Орыс тілі',
    'Ағылшын тілі',
    'English Plus',
    'Еңбек',
    'Балабақша',
    'Дене шынықтыру',
    'Алгебра ЖМБ',
    'Геометрия ЖМБ',
    'Алгебра Гуманитарлық',
    'Геометрия Гуманитарлық',
    'Қазақ тілі ЖМБ',
    'Қазақ тілі',
    'Қазақ тілі Гуманитарлық'
];

export interface ExistingFile {
    id: string;
    name: string;
    size: string;
    path: string;
}

export interface EditKMJFormData {
    // Негізгі ақпарат
    classLevel: ClassLevel;
    quarter: Quarter;
    subjectCode: SubjectCode;
    hours: number;

    // Сабақ мазмұны
    lessonTopic: string;
    learningObjectives: string;

    // Файлдар
    mainFile?: File;
    additionalFiles?: File[];
    existingAdditionalFiles: ExistingFile[];

    // Санаттар
    subjects: Subject[];
    institutionType: InstitutionType;
}

export interface KMJData {
    id: string;
    title: string;
    classLevel: ClassLevel;
    quarter: Quarter;
    subjectCode: SubjectCode;
    hours: number;
    lessonTopic: string;
    learningObjectives: string;
    existingAdditionalFiles: ExistingFile[];
    subjects: Subject[];
    institutionType: InstitutionType;
}
