export type SubjectCardItem = {
    id: number;
    title: string;
    description?: string;
};

export type SubjectSections = {
    presentations: SubjectCardItem[];
    workSheets: SubjectCardItem[];
    subjects: SubjectCardItem[];
};

export const subjectSectionsMock: SubjectSections = {
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
    subjects: [
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
