import { useState } from 'react';
import { Container } from '@/shared/ui/container';
import { SectionTitle } from '@/shared/ui/section-title';
import { SearchInput } from '@/shared/ui/search-input';
import { SubjectCard } from '@/entities/subject/ui';
import s from './SubjectWorkSheetsPage.module.scss';
import { workSheetsMock } from '../model/mock';
import { SubjectNavigator } from '@/widgets/subject-navigator';

export const SubjectWorkSheetsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWorkSheets = workSheetsMock.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = () => {
        console.log('Поиск рабочих листов:', searchQuery);
    };

    return (
        <main className={s.page}>
            <Container>
                <SectionTitle title="Математика" />

                <SearchInput
                    className={s.searchInput}
                    placeholder="Поиск по рабочим листам..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onSubmit={handleSearch}
                />

                <SubjectNavigator subjectCode="math" />
                <SectionTitle title={`Рабочие листы`} />
                <div className={s.grid}>
                    {filteredWorkSheets.map(item => (
                        <SubjectCard
                            key={item.id}
                            title={item.title}
                            path={`/subject-presentation-detail`}
                        />
                    ))}

                    {filteredWorkSheets.length === 0 && searchQuery && (
                        <div className={s.noResults}>
                            По запросу "{searchQuery}" рабочих листов не найдено
                        </div>
                    )}
                </div>
            </Container>
        </main>
    );
};

export default SubjectWorkSheetsPage;
