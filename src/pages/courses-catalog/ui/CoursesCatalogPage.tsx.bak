import { SectionTitle } from '@/shared/ui/SectionTitle';
import s from './CoursesCatalogPage.module.scss';
import { Container } from '@/shared/ui/Container';
import { Input } from '@/shared/ui/Input';
import SearchIcon from '@/shared/assets/icons/search.svg?react';
import { CourseCard } from '@/entities/course/ui';
import { mockCourses } from '@/entities/course/model/mockCourses';

export const CoursesCatalogPage = () => {
    return (
        <main className={s.courseCatalogPage}>
            <Container className={s.container}>
                <SectionTitle
                    className={s.title}
                    title="Каталог курсов"
                />

                <form className={s.inputWrapper}>
                    <Input
                        leftIcon={<SearchIcon className={s.searchIcon} />}
                        className={s.searchInput}
                        placeholder="Поиск по названию курса, категории или теме..."
                    />
                </form>

                <div className={s.cardsContainer}>
                    {mockCourses.map(course => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            title={course.title}
                            description={course.description}
                        />
                    ))}
                </div>
            </Container>
        </main>
    );
};

export default CoursesCatalogPage;
