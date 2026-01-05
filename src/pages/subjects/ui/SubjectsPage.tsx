import { useMemo, useState } from 'react';
import { AlertTriangle, Search } from 'lucide-react';

import { SectionTitle } from '@/shared/ui/section-title';
import { Container } from '@/shared/ui/container';
import { SearchInput } from '@/shared/ui/search-input';
import { Button } from '@/shared/ui/button';

import { SubjectCard } from '@/entities/subject/ui';
import { useSubjects } from '@/entities/subject/model/useSubjects';

import s from './SubjectsPage.module.scss';

const PAGE_SIZE = 9;

export const SubjectsPage = () => {
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const { data: subjects = [], isLoading, isError, refetch } = useSubjects();

    const filteredSubjects = useMemo(() => {
        let filtered = subjects.filter(
            subject => subject.name.toLowerCase().includes(search.toLowerCase())
            // (subject.description?.toLowerCase() || '').includes(
            //     search.toLowerCase()
            // )
        );

        return filtered;
    }, [subjects, search, activeFilter]);

    const visibleSubjects = filteredSubjects.slice(0, visibleCount);
    const hasMore = visibleCount < filteredSubjects.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + PAGE_SIZE);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setVisibleCount(PAGE_SIZE);
    };

    const handleRetry = () => {
        refetch();
    };

    const handleClearSearch = () => {
        setSearch('');
        setActiveFilter(null);
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

                    <div className={s.searchContainer}>
                        <SearchInput
                            className={s.searchInput}
                            placeholder="Поиск по названию курса, категории или теме..."
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            onSubmit={() => {}}
                        />
                    </div>

                    {/* <div className={s.filters}>
                        <button
                            className={`${s.filterChip} ${
                                !activeFilter ? s.active : ''
                            }`}
                            onClick={() => setActiveFilter(null)}>
                            Все курсы
                        </button>
                        <button
                            className={`${s.filterChip} ${
                                activeFilter === 'school' ? s.active : ''
                            }`}
                            onClick={() => setActiveFilter('school')}>
                            Для школы
                        </button>
                        <button
                            className={`${s.filterChip} ${
                                activeFilter === 'university' ? s.active : ''
                            }`}
                            onClick={() => setActiveFilter('university')}>
                            Для университета
                        </button>
                        <button
                            className={`${s.filterChip} ${
                                activeFilter === 'programming' ? s.active : ''
                            }`}
                            onClick={() => setActiveFilter('programming')}>
                            Программирование
                        </button>
                    </div> */}
                </div>

                <SubjectCard title="sadsa" />

                {isLoading && (
                    <div className={s.loadingState}>
                        <div className={s.spinnerContainer}>
                            <div className={s.spinner}></div>
                            <div className={s.spinnerRing}></div>
                        </div>
                        <p className={s.loadingText}>Курстар жүктелуде...</p>
                        <p className={s.loadingSubtext}>Біраз уақыт күтіңіз</p>
                    </div>
                )}

                {isError && (
                    <div className={s.errorState}>
                        <div className={s.errorIcon}>
                            <AlertTriangle />
                        </div>
                        <h3 className={s.errorTitle}>Жүктеу сәтсіз аяқталды</h3>
                        <p className={s.errorDescription}>
                            Курстарды жүктеу кезінде қате пайда болды. Өтінеміз,
                            қайта байқап көріңіз.
                        </p>
                        <button
                            className={s.retryButton}
                            onClick={handleRetry}>
                            Қайта жүктеу
                        </button>
                    </div>
                )}

                {!isLoading && !isError && (
                    <>
                        {visibleSubjects.length > 0 ? (
                            <>
                                <div className={s.cardsContainer}>
                                    {visibleSubjects.map(subject => (
                                        <SubjectCard
                                            key={subject.id}
                                            id={subject.id}
                                            title={subject.name}
                                            // description={subject.description}
                                            thumbnail={
                                                subject.image_url ?? undefined
                                            }
                                            path={`/subjects-materials/${
                                                subject.code || subject.id
                                            }`}
                                            // delay={index * 50} // Добавляем задержку для анимации
                                        />
                                    ))}
                                </div>

                                {hasMore && (
                                    <div className={s.loadMoreContainer}>
                                        <Button
                                            className={s.loadMoreButton}
                                            onClick={handleLoadMore}>
                                            Көбірек көрсету
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={s.emptyState}>
                                <div className={s.emptyIcon}>
                                    <Search />
                                </div>
                                <h3 className={s.emptyTitle}>
                                    Курстар табылмады
                                </h3>
                                <p className={s.emptyDescription}>
                                    {search ? (
                                        <>
                                            &quot;{search}&quot; сөзі бойынша
                                            сәйкес келетін курстар жоқ. Басқа
                                            сөздермен іздеп көріңіз немесе
                                            барлық курстарды көріңіз.
                                        </>
                                    ) : (
                                        'Әзірше ешбір курс қолжетімді емес'
                                    )}
                                </p>
                                {search && (
                                    <button
                                        className={s.clearSearchButton}
                                        onClick={handleClearSearch}>
                                        Барлық курстарды көрсету
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </Container>
        </main>
    );
};

export default SubjectsPage;
