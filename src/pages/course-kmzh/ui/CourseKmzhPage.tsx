import { SectionTitle } from '@/shared/ui/SectionTitle';
import s from './CourseKmzhPage.module.scss';
import { Container } from '@/shared/ui/Container';
import { Input } from '@/shared/ui/Input';
import SearchIcon from '@/shared/assets/icons/search.svg?react';
import { CourseNavigator } from '@/widgets/course-navigator';
import { NavigationCard } from '@/shared/ui/NavigationCard';
import NoteIcon from '@/shared/assets/icons/note.svg?react';
import { kmzhMock } from '../model/courseSectionsMock.mock';

export const CourseKmzhPage = () => {
    return (
        <main className={s.courseKmzhPage}>
            <Container>
                <SectionTitle title="Математика" />

                <Input
                    className={s.searchInput}
                    placeholder="Поиск"
                    leftIcon={<SearchIcon className={s.searchIcon} />}
                />

                <CourseNavigator subjectCode="math" />

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

export default CourseKmzhPage;
