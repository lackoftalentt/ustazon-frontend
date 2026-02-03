import type { QMJContent } from '@/shared/api/qmjAiApi';
import {
    QMJLessonInfoBlock,
    QMJStagesBlock,
    QMJDifferentiationBlock,
    QMJReflectionBlock,
    QMJHomeworkBlock,
} from '../blocks';
import s from './QMJDocument.module.scss';

interface Props {
    content: QMJContent;
}

export const QMJDocument = ({ content }: Props) => {
    const { meta, lesson_info, stages, differentiation, reflection, homework } = content;

    return (
        <div className={s.pageWrapper}>
            <article className={s.page}>
                <div className={s.metaBar}>
                    <span>{meta.subject}</span>
                    <span>{meta.grade}</span>
                </div>

                <h1 className={s.title}>
                    Қысқа мерзімді жоспар
                </h1>
                <h2 className={s.topic}>{meta.topic}</h2>

                <QMJLessonInfoBlock info={lesson_info} />
                <QMJStagesBlock stages={stages} />
                <QMJDifferentiationBlock differentiation={differentiation} />
                <QMJReflectionBlock reflection={reflection} />
                <QMJHomeworkBlock homework={homework} />
            </article>
        </div>
    );
};
