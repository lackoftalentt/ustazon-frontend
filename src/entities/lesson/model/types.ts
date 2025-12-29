export interface Lesson {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: number; // в секундах
    order: number;
    sectionId: string;
    subjectId: string;
    createdAt: string;
    updatedAt: string;
}

export interface LessonDetail extends Lesson {
    section: {
        id: string;
        title: string;
    };
    subject: {
        id: string;
        title: string;
        totalLessons: number;
        totalDuration: number;
    };
    nextLessonId: string | null;
    prevLessonId: string | null;
    tasks: LessonTask[];
}

export interface LessonTask {
    id: string;
    title: string;
    type: 'test' | 'assignment';
    questionsCount?: number;
}

export interface LessonProgress {
    lessonId: string;
    watchedSeconds: number;
    isCompleted: boolean;
    completedAt: string | null;
}
