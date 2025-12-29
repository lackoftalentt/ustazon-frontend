import { Container } from '@/shared/ui/Container';
import { SectionTitle } from '@/shared/ui/SectionTitle';
import { CourseCard } from '@/entities/course/ui';
import s from './CoursePresentationsPage.module.scss';
import { presentationsMock } from '../model/mock';
import { CourseNavigator } from '@/widgets/course-navigator';

export const CoursePresentationsPage = () => {
    return (
        <main className={s.page}>
            <Container>
                <SectionTitle title="Математика" />
                <CourseNavigator subjectCode="math" />
                <SectionTitle title="Презентации" />
                <div className={s.grid}>
                    {presentationsMock.map(item => (
                        <CourseCard
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            path={`/course-detail`}
                        />
                    ))}
                </div>
            </Container>
        </main>
    );
};

export default CoursePresentationsPage;
