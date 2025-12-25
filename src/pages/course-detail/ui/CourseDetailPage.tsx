import s from './CourseDetailPage.module.scss';
import { SectionTitle } from '@/shared/ui/SectionTitle';
import { CourseDetailSidebar } from '@/widgets/course-detail-sidebar';
import { CourseDetailComments } from '@/widgets/course-detail-comments/ui/CourseDetailComments';
import { CourseDetailPlayer } from '@/widgets/course-detail-player/ui/CourseDetailPlayer';
import { Container } from '@/shared/ui/Container';

export const CourseDetailPage = () => {
    return (
        <main className={s.page}>
            <Container className={s.layout}>
                <section className={s.main}>
                    <header className={s.header}>
                        <div>
                            <SectionTitle title="Математика" />
                            <p className={s.subtitle}>Тема: Тема материала</p>
                        </div>
                    </header>
                    <CourseDetailPlayer />
                    <CourseDetailComments />
                </section>

                <aside className={s.sidebar}>
                    <CourseDetailSidebar />
                </aside>
            </Container>
        </main>
    );
};
export default CourseDetailPage