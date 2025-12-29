import type { LessonPlanRow, QuarterId } from './types';

const makeRows = (quarter: QuarterId, count: number): LessonPlanRow[] => {
    return Array.from({ length: count }, (_, i) => {
        const n = i + 1;

        return {
            id: `${quarter}-${n}`,
            index: n,
            topic: `Тақырып ${n}`,
            objectives: [
                { code: `5.${n}.1.1`, text: `Мақсат ${n}.1` },
                { code: `5.${n}.1.2`, text: `Мақсат ${n}.2` }
            ],
            hours: 1,
            author: 'UstazOn',
            filesCount: n % 3
        };
    });
};

export const lessonPlanMockByQuarter: Record<QuarterId, LessonPlanRow[]> = {
    q1: makeRows('q1', 15),
    q2: makeRows('q2', 8),
    q3: makeRows('q3', 5),
    q4: makeRows('q4', 3)
};
