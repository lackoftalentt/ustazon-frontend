import s from './SubjectDetailPage.module.scss';
import { SectionTitle } from '@/shared/ui/section-title';
import { SubjectDetailSidebar } from '@/widgets/subject-detail-sidebar';
import { SubjectDetailComments } from '@/widgets/subject-detail-comments/ui/SubjectDetailComments';
import { SubjectDetailPlayer } from '@/widgets/subject-detail-player/ui/SubjectDetailPlayer';
import { Container } from '@/shared/ui/container';

export const SubjectDetailPage = () => {
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
                    <SubjectDetailPlayer />
                    <SubjectDetailComments />
                </section>

                <aside className={s.sidebar}>
                    <SubjectDetailSidebar />
                </aside>
            </Container>
        </main>
    );
};
export default SubjectDetailPage;
