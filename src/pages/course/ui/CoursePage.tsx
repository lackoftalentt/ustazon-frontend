import { SectionTitle } from '@/shared/ui/SectionTitle';
import s from './CoursePage.module.scss';
import { Container } from '@/shared/ui/Container';
import { Input } from '@/shared/ui/Input';
import SearchIcon from '@/shared/assets/icons/search.svg?react';
import { CourseNavigator } from '@/widgets/course-navigator';
import { NavigationCard } from '@/shared/ui/NavigationCard';
import NoteIcon from '@/shared/assets/icons/note.svg?react';
import { courseSectionsMock } from '../model/courseSections.mock';

import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react';
import { CourseCard } from '@/entities/course/ui';
import { Link } from 'react-router';

export const CoursePage = () => {
    const { presentations, workSheets } = courseSectionsMock;
    return (
        <main className={s.coursePage}>
            <Container>
                {' '}
                <SectionTitle title="Математика" />
                <Input
                    className={s.searchInput}
                    placeholder="Поиск"
                    leftIcon={<SearchIcon className={s.searchIcon} />}
                />
                <CourseNavigator />
                <SectionTitle title="КМЖ" />{' '}
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
                {/* <SectionTitle title="Название страницы" />{' '}
                <div className={s.container}>
                    <NavigationCard
                        icon={NoteIcon}
                        title="Название страницы"
                        path="/kmzh"
                    />
                    <NavigationCard
                        icon={NoteIcon}
                        title="Название страницы"
                        path="/kmzh"
                    />
                    <NavigationCard
                        icon={NoteIcon}
                        title="Название страницы"
                        path="/kmzh"
                    />
                    <Link
                        to={'kmzh'}
                        className={s.showMoreLink}>
                        Показать больше
                    </Link>
                </div> */}
                <SectionTitle title="Презентации" />
                <div className={s.container}>
                    {presentations.map(item => (
                        <CourseCard
                            key={item.id}
                            title={item.title}
                            path={`/course-detail`}
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
                        <CourseCard
                            key={item.id}
                            title={item.title}
                            path={'/course-detail'}
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
export default CoursePage;
