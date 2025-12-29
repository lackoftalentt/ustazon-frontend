import { Container } from '@/shared/ui/Container';
import { SectionTitle } from '@/shared/ui/SectionTitle';
import { CourseCard } from '@/entities/course/ui';
import s from './CourseWorkSheetsPage.module.scss';
import { workSheetsMock } from '../model/mock';
import { CourseNavigator } from '@/widgets/course-navigator';

export const CourseWorkSheetsPage = () => {
    return (
        <main className={s.page}>
            <Container>
                <SectionTitle title="Математика" />
                <CourseNavigator subjectCode="math" />
                <SectionTitle title="Рабочие листы" />

                <div className={s.grid}>
                    {workSheetsMock.map(item => (
                        <CourseCard
                            key={item.id}
                            title={item.title}
                            path={`/course-detail`}
                        />
                    ))}
                </div>
            </Container>
        </main>
    );
};

export default CourseWorkSheetsPage;
