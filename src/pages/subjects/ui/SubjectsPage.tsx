import { useMemo, useState } from 'react';

import { SectionTitle } from '@/shared/ui/section-title';
import { Container } from '@/shared/ui/container';
import { SearchInput } from '@/shared/ui/search-input';
import { Button } from '@/shared/ui/button';

import { SubjectCard } from '@/entities/subject/ui';
import { useSubjects } from '@/entities/subject/model/useSubjects';

import s from './SubjectsPage.module.scss';

const PAGE_SIZE = 9;

const institutionTypes = [
    {
        name: 'Мектеп',
        code: null,
        id: 1,
        created_at: '2025-12-30T18:40:39.719645',
        updated_at: '2025-12-30T18:40:39.719651'
    },
    {
        name: 'Университет',
        code: null,
        id: 2,
        created_at: '2025-12-30T18:40:39.721469',
        updated_at: '2025-12-30T18:40:39.721471'
    },
    {
        name: 'Колледж',
        code: null,
        id: 3,
        created_at: '2025-12-30T18:40:39.722375',
        updated_at: '2025-12-30T18:40:39.722377'
    },
    {
        name: 'Балабақша',
        code: null,
        id: 4,
        created_at: '2025-12-30T18:40:39.723240',
        updated_at: '2025-12-30T18:40:39.723243'
    },
    {
        name: 'Python тілін үйрену',
        code: null,
        id: 5,
        created_at: '2025-12-30T18:40:39.724044',
        updated_at: '2025-12-30T18:40:39.724046'
    }
];

export const SubjectsPage = () => {
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const { data: subjects = [], isLoading, isError } = useSubjects();
    console.log(subjects);

    const filteredSubjects = useMemo(
        () =>
            subjects.filter(subject =>
                subject.name.toLowerCase().includes(search.toLowerCase())
            ),
        [subjects, search]
    );

    const visibleSubjects = filteredSubjects.slice(0, visibleCount);
    const hasMore = visibleCount < filteredSubjects.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + PAGE_SIZE);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setVisibleCount(PAGE_SIZE);
    };

    return (
        <main className={s.subjectMaterialPage}>
            <Container className={s.container}>
                <div className={s.header}>
                    <SectionTitle
                        className={s.title}
                        title="Каталог курсов"
                    />

                    <SearchInput
                        className={s.searchInput}
                        placeholder="Поиск по названию курса, категории или теме..."
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                        onSubmit={() => {}}
                    />
                </div>

                {isLoading && <p>Загрузка...</p>}
                {isError && <p>Ошибка загрузки данных</p>}

                <div className={s.cardsContainer}>
                    {visibleSubjects.map(subject => (
                        <SubjectCard
                            key={subject.id}
                            id={subject.id}
                            title={subject.name}
                            thumbnail={subject.image_url ?? undefined}
                            path={`/subjects-materials/${subject.code}`}
                        />
                    ))}
                </div>

                {hasMore && (
                    <div className={s.loadMoreContainer}>
                        <Button onClick={handleLoadMore}>Загрузить ещё</Button>
                    </div>
                )}
            </Container>
        </main>
    );
};

export default SubjectsPage;
