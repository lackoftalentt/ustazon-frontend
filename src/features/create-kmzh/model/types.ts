export type ClassLevel =
    | '1-сынып' | '2-сынып' | '3-сынып' | '4-сынып'
    | '5-сынып' | '6-сынып' | '7-сынып' | '8-сынып'
    | '9-сынып' | '10-сынып' | '11-сынып';

export type Quarter = '1 тоқсан' | '2 тоқсан' | '3 тоқсан' | '4 тоқсан';

export const CLASS_LEVELS: ClassLevel[] = [
    '1-сынып', '2-сынып', '3-сынып', '4-сынып',
    '5-сынып', '6-сынып', '7-сынып', '8-сынып',
    '9-сынып', '10-сынып', '11-сынып'
];

export const QUARTERS: Quarter[] = [
    '1 тоқсан', '2 тоқсан', '3 тоқсан', '4 тоқсан'
];

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
export const MAX_HOURS = 10;

export interface CreateKMZHFormData {
    subjectCode: string;
    classLevel: string;
    quarter: string;
    hours: number;
    lessonTopic: string;
    learningObjectives: string;
    files: File[];
    institutionTypeIds: number[];
}
