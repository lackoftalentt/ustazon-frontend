import { useParams } from 'react-router-dom';
import { useLessonQuery } from '@/entities/lesson';
import { Loader } from '@/shared/ui/loader';
import { SectionTitle } from '@/shared/ui/section-title';
import { SubjectDetailSidebar } from '@/widgets/subject-detail-sidebar';
import { SubjectDetailComments } from '@/widgets/subject-detail-comments/ui/SubjectDetailComments';
import { SubjectDetailPlayer } from '@/widgets/subject-detail-player/ui/SubjectDetailPlayer';
import { Container } from '@/shared/ui/container';
import s from './SubjectDetailPage.module.scss';

export const SubjectDetailPageWithApi = () => {
    const { lessonId } = useParams<{ lessonId: string }>();

    const {
        data: lesson,
        isLoading,
        isError,
        error
    } = useLessonQuery(lessonId ?? '');

    if (isLoading) {
        return (
            <main className={s.page}>
                <Container className={s.layout}>
                    <div className={s.loaderWrapper}>
                        <Loader />
                    </div>
                </Container>
            </main>
        );
    }

    if (isError) {
        return (
            <main className={s.page}>
                <Container className={s.layout}>
                    <div className={s.errorState}>
                        <h2>Ошибка загрузки</h2>
                        <p>{error?.message || 'Не удалось загрузить урок'}</p>
                    </div>
                </Container>
            </main>
        );
    }

    if (!lesson) {
        return (
            <main className={s.page}>
                <Container className={s.layout}>
                    <div className={s.errorState}>
                        <h2>Урок не найден</h2>
                    </div>
                </Container>
            </main>
        );
    }

    return (
        <main className={s.page}>
            <Container className={s.layout}>
                <section className={s.main}>
                    <header className={s.header}>
                        <div>
                            <SectionTitle title={lesson.subject.title} />
                            <p className={s.subtitle}>Тема: {lesson.title}</p>
                        </div>
                    </header>
                    <SubjectDetailPlayer
                    // videoUrl={lesson.videoUrl}
                    // lessonId={lesson.id}
                    />
                    <SubjectDetailComments lessonId={lesson.id} />
                </section>

                <aside className={s.sidebar}>
                    <SubjectDetailSidebar
                    // lesson={lesson}
                    // onBack={() => navigate(`/subjects/${lesson.subjectId}`)}
                    />
                </aside>
            </Container>
        </main>
    );
};
