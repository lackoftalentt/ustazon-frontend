export type QuarterId = 'q1' | 'q2' | 'q3' | 'q4';

export type Objective = {
    code: string;
    text: string;
};

export type LessonPlanRow = {
    id: string;
    index: number;
    topic: string;
    objectives: Objective[];
    hours: number;
    author: string;
    filesCount: number;
};
