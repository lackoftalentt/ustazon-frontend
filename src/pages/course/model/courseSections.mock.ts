export type CourseCardItem = {
    id: number;
    title: string;
    description?: string;
};

export type CourseSections = {
    presentations: CourseCardItem[];
    workSheets: CourseCardItem[];
    courses: CourseCardItem[];
};

export const courseSectionsMock: CourseSections = {
    presentations: [
        { id: 101, title: 'Презентация 1' },
        { id: 102, title: 'Презентация 2' },
        { id: 103, title: 'Презентация 3' }
    ],
    workSheets: [
        { id: 201, title: 'Рабочий лист 1' },
        { id: 202, title: 'Рабочий лист 2' },
        { id: 203, title: 'Рабочий лист 3' }
    ],
    courses: [
        {
            id: 301,
            title: 'Название курса',
            description: 'Краткое описание курса. В несколько предложений'
        },
        {
            id: 302,
            title: 'Название курса',
            description: 'Краткое описание курса. В несколько предложений'
        },
        {
            id: 303,
            title: 'Название курса',
            description: 'Краткое описание курса. В несколько предложений'
        }
    ]
};
