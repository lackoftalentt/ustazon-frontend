import { SectionTitle } from '@/shared/ui/SectionTitle';
import s from './CoursePage.module.scss';
import { Container } from '@/shared/ui/Container';
import { Input } from '@/shared/ui/Input';
import SearchIcon from '@/shared/assets/icons/search.svg?react';
import { CourseNavigator } from '@/widgets/course-navigator';
import { NavigationCard } from '@/shared/ui/NavigationCard';
import NoteIcon from '@/shared/assets/icons/note.svg?react';
import { Button } from '@/shared/ui/Button';

import Up from '@/shared/assets/icons/up.svg?react';
import { CourseCard } from '@/entities/course/ui';

export const CoursePage = () => {
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
                <div className={s.container}>
                    {' '}
                    <NavigationCard
                        icon={NoteIcon}
                        title="КМЖ"
                        to="/"
                    />
                    <NavigationCard
                        icon={NoteIcon}
                        title="КМЖ"
                        to="/"
                    />
                    <NavigationCard
                        icon={NoteIcon}
                        title="КМЖ"
                        to="/"
                    />
                    <Button
                        className={s.loadMoreBtn}
                        variant="outline">
                        Показать больше
                        <Up className={s.iconInBtn} />
                    </Button>
                </div>
                <div className={s.container}>
                    {' '}
                    <NavigationCard
                        icon={NoteIcon}
                        title="Название страницы"
                        to="/"
                    />
                    <NavigationCard
                        icon={NoteIcon}
                        title="Название страницы"
                        to="/"
                    />
                    <NavigationCard
                        icon={NoteIcon}
                        title="Название страницы"
                        to="/"
                    />
                    <Button
                        className={s.loadMoreBtn}
                        variant="outline">
                        Показать больше
                        <Up className={s.iconInBtn} />
                    </Button>
                </div>
                <div className={s.container}>
                    {' '}
                    <CourseCard title="Презентация 1" />
                    <CourseCard title="Презентация 2" />
                    <CourseCard title="Презентация 3" />
                    <Button
                        className={s.loadMoreBtn}
                        variant="outline">
                        Показать больше
                        <Up className={s.iconInBtn} />
                    </Button>
                </div>
                <div className={s.container}>
                    {' '}
                    <CourseCard title="Рабочий лист 1" />
                    <CourseCard title="Рабочий лист 2" />
                    <CourseCard title="Рабочий лист 3" />
                    <Button
                        className={s.loadMoreBtn}
                        variant="outline">
                        Показать больше
                        <Up className={s.iconInBtn} />
                    </Button>
                </div>
                <div className={s.container}>
                    {' '}
                    <CourseCard
                        title="Название курса"
                        description="Краткое описание курса. В несколько предложений"
                    />
                    <CourseCard
                        title="Название курса"
                        description="Краткое описание курса. В несколько предложений"
                    />
                    <CourseCard
                        title="Название курса"
                        description="Краткое описание курса. В несколько предложений"
                    />
                    <Button
                        className={s.loadMoreBtn}
                        variant="outline">
                        Показать больше
                        <Up className={s.iconInBtn} />
                    </Button>
                </div>
            </Container>
        </main>
    );
};
