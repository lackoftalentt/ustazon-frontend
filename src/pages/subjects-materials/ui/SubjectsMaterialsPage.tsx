import { useState } from 'react';

import { SectionTitle } from '@/shared/ui/section-title';
import { Container } from '@/shared/ui/container';
import { SearchInput } from '@/shared/ui/search-input';

import { SubjectCard } from '@/entities/subject/ui';
import { mockSubjects } from '@/entities/subject/model/mockSubjects';

import s from './SubjectsMaterialsPage.module.scss';

export const SubjectsMaterialPage = () => {
    const [search, setSearch] = useState('');

    const filteredSubjects = mockSubjects.filter(subject =>
        subject.title.toLowerCase().includes(search.toLowerCase())
    );

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
                        onChange={e => setSearch(e.target.value)}
                        onSubmit={() => {}}
                    />
                </div>

                <div className={s.cardsContainer}>
                    {filteredSubjects.map(subject => (
                        <SubjectCard
                            key={subject.id}
                            id={subject.id}
                            title={subject.title}
                            description={subject.description}
                            path={`/subject/${subject.id}`}
                        />
                    ))}
                </div>
            </Container>
        </main>
    );
};

export default SubjectsMaterialPage;
