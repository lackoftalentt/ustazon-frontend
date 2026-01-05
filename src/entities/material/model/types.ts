export type MaterialType = 'all' | 'card' | 'test' | 'kmzh' | 'presentation';

export interface SavedMaterial {
    id: string;
    title: string;
    description?: string;
    type: Exclude<MaterialType, 'all'>;
    thumbnail?: string;
    savedAt: string;
    path: string;
    subjectName?: string;
}

export interface UserStats {
    savedMaterials: number;
    completedTests: number;
    viewedCards: number;
}

export const materialTypeLabels: Record<MaterialType, string> = {
    all: 'Барлығы',
    card: 'Карточкалар',
    test: 'Тесттер',
    kmzh: 'КМЖ',
    presentation: 'Презентациялар'
};

export const materialTypeBadgeLabels: Record<Exclude<MaterialType, 'all'>, string> = {
    card: 'Карточка',
    test: 'Тест',
    kmzh: 'КМЖ',
    presentation: 'Презентация'
};
