import { useState } from 'react';
import { SectionTitle } from '@/shared/ui/SectionTitle';
import s from './CoursesCatalogPage.module.scss';
import { Container } from '@/shared/ui/Container';
import { Input } from '@/shared/ui/Input';
import SearchIcon from '@/shared/assets/icons/search.svg?react';
import { CourseCard } from '@/entities/course/ui';
import { useSubjects } from '@/entities/subject/model/useSubjects';
import { Loader } from '@/shared/ui/Loader';

export const CoursesCatalogPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: subjects, isLoading } = useSubjects({ limit: 100 });

    // Filter subjects by search query
    const filteredSubjects = subjects?.filter(subject =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <main className={s.courseCatalogPage}>
                <Container className={s.container}>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <Loader />
                    </div>
                </Container>
            </main>
        );
    }

    return (
        <main className={s.courseCatalogPage}>
            <Container className={s.container}>
                <SectionTitle
                    className={s.title}
                    title="Каталог курсов"
                />

                <form className={s.inputWrapper} onSubmit={(e) => e.preventDefault()}>
                    <Input
                        leftIcon={<SearchIcon className={s.searchIcon} />}
                        className={s.searchInput}
                        placeholder="Поиск по названию курса, категории или теме..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                <div className={s.cardsContainer}>
                    {filteredSubjects.map(subject => (
                        <CourseCard
                            key={subject.id}
                            id={subject.id}
                            title={subject.name}
                            description={`Код предмета: ${subject.code}`}
                            path={`/course/${subject.code}`}
                        />
                    ))}
                </div>

                {filteredSubjects.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                        <div style={{ fontSize: '18px', fontWeight: 500 }}>
                            {searchQuery ? 'Предметы не найдены' : 'Нет доступных предметов'}
                        </div>
                    </div>
                )}
            </Container>
        </main>
    );
};

export default CoursesCatalogPage;
