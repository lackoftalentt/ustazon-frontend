import { useState } from 'react';
import { Container } from '@/shared/ui/container';
import { SectionTitle } from '@/shared/ui/section-title';
import { SearchInput } from '@/shared/ui/search-input';
import { SubjectCard } from '@/entities/subject/ui';
import s from './SubjectPresentationsPage.module.scss';
import { presentationsMock } from '../model/mock';
import { SubjectNavigator } from '@/widgets/subject-navigator';

export const SubjectPresentationsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPresentations = presentationsMock.filter(
        item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = () => {
        console.log('Поиск презентаций:', searchQuery);
    };

    return (
        <main className={s.page}>
            <Container>
                <SectionTitle title="Математика" />

                <SearchInput
                    className={s.searchInput}
                    placeholder="Поиск по презентациям..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onSubmit={handleSearch}
                />

                <SubjectNavigator subjectCode="math" />
                <SectionTitle title="Презентации" />
                <div className={s.grid}>
                    {filteredPresentations.map(item => (
                        <SubjectCard
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            path={`/subject-presentation-detail`}
                        />
                    ))}

                    {filteredPresentations.length === 0 && searchQuery && (
                        <div className={s.noResults}>
                            По запросу "{searchQuery}" ничего не найдено
                        </div>
                    )}
                </div>
            </Container>
        </main>
    );
};

export default SubjectPresentationsPage;
