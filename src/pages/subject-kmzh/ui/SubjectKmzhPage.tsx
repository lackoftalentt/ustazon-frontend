import { SectionTitle } from '@/shared/ui/section-title';
import s from './SubjectKmzhPage.module.scss';
import { Container } from '@/shared/ui/container';
import { Input } from '@/shared/ui/input';
import SearchIcon from '@/shared/assets/icons/search.svg?react';
import { SubjectNavigator } from '@/widgets/subject-navigator';
import { NavigationCard } from '@/shared/ui/navigation-card';
import NoteIcon from '@/shared/assets/icons/note.svg?react';
import { kmzhMock } from '../model/subjectSectionsMock.mock';

export const SubjectKmzhPage = () => {
    return (
        <main className={s.subjectKmzhPage}>
            <Container>
                <SectionTitle title="Математика" />

                <Input
                    className={s.searchInput}
                    placeholder="Поиск"
                    leftIcon={<SearchIcon className={s.searchIcon} />}
                />

                <SubjectNavigator subjectCode="math" />

                <SectionTitle title="КМЖ" />

                <div className={s.grid}>
                    {kmzhMock.map(item => (
                        <NavigationCard
                            key={item.id}
                            icon={NoteIcon}
                            title={item.title}
                            path={item.path}
                        />
                    ))}
                </div>
            </Container>
        </main>
    );
};

export default SubjectKmzhPage;
