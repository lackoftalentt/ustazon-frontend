import s from './SubjectPresentationDetailPage.module.scss';
import { SectionTitle } from '@/shared/ui/section-title';
import { SubjectDetailComments } from '@/widgets/subject-detail-comments';
import { PresentationViewer } from '@/widgets/presentation-viewer';
import { SubjectDetailSidebar } from '@/widgets/subject-detail-sidebar';
import { Container } from '@/shared/ui/container';

export const SubjectPresentationDetailPage = () => {
    const documents = [
        {
            uri: '/files/assignment_2 (3).pdf',
            fileName: 'Документ PDF'
        }
    ];

    return (
        <main className={s.page}>
            <Container>
                {' '}
                <div className={s.layout}>
                    <section className={s.main}>
                        <header className={s.header}>
                            <div>
                                <SectionTitle title="Математика" />
                                <p className={s.subtitle}>
                                    Тема: Тема материала
                                </p>
                            </div>
                        </header>

                        <PresentationViewer documents={documents} />
                        <SubjectDetailComments />
                    </section>

                    <aside className={s.sidebar}>
                        <SubjectDetailSidebar />
                    </aside>
                </div>
            </Container>
        </main>
    );
};

export default SubjectPresentationDetailPage;
