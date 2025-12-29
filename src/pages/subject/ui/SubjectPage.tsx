import { SectionTitle } from '@/shared/ui/section-title';
import s from './SubjectPage.module.scss';
import { Container } from '@/shared/ui/container';
import { SearchInput } from '@/shared/ui/search-input';
import { SubjectNavigator } from '@/widgets/subject-navigator';
import { NavigationCard } from '@/shared/ui/navigation-card';
import NoteIcon from '@/shared/assets/icons/note.svg?react';
import { subjectSectionsMock } from '../model/subjectSections.mock';

import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react';
import { SubjectCard } from '@/entities/subject/ui';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const SubjectPage = () => {
    const { presentations, workSheets } = subjectSectionsMock;

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        console.log('Выполняется поиск:', searchQuery);
    };

    return (
        <main className={s.subjectPage}>
            <Container>
                <SectionTitle title="Математика" />

                <SearchInput
                    className={s.searchInput}
                    placeholder="Поиск по материалам курса..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onSubmit={handleSearch}
                />

                <SubjectNavigator />
                <SectionTitle title="КМЖ" />
                <div className={s.container}>
                    <NavigationCard
                        icon={NoteIcon}
                        title="КМЖ"
                        path="/kmzh"
                    />
                    <NavigationCard
                        icon={NoteIcon}
                        title="КМЖ"
                        path="/kmzh"
                    />
                    <NavigationCard
                        icon={NoteIcon}
                        title="КМЖ"
                        path="/kmzh"
                    />
                    <Link
                        to={'kmzh'}
                        className={s.showMoreLink}>
                        Показать больше
                        <ArrowIcon className={s.arrowIcon} />
                    </Link>
                </div>

                <SectionTitle title="Презентации" />
                <div className={s.container}>
                    {presentations.map(item => (
                        <SubjectCard
                            key={item.id}
                            title={item.title}
                            path={`/subject-presentation-detail`}
                        />
                    ))}

                    <Link
                        to={'presentations'}
                        className={s.showMoreLink}>
                        Показать больше
                        <ArrowIcon className={s.arrowIcon} />
                    </Link>
                </div>
                <SectionTitle title="Рабочие листы" />
                <div className={s.container}>
                    {workSheets.map(item => (
                        <SubjectCard
                            key={item.id}
                            title={item.title}
                            path={'/subject-detail'}
                        />
                    ))}

                    <Link
                        to={'work-sheets'}
                        className={s.showMoreLink}>
                        Показать больше
                        <ArrowIcon className={s.arrowIcon} />
                    </Link>
                </div>
            </Container>
        </main>
    );
};

export default SubjectPage;
