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
                <div className={s.headerRow}>
                    <div className={s.headerLeft}>
                        <h1 className={s.title}>
                            Қысқа мерзімді сабақ жоспары
                        </h1>
                        <div className={s.headerMeta}>
                            {meta.subject} {meta.grade}
                        </div>
                    </div>
                    <div className={s.headerRight}>
                        <div className={s.approvalBlock}>
                            <span className={s.approvalLabel}>Бекітемін:</span>
                            <span className={s.approvalLine}>___________________</span>
                        </div>
                    </div>
                </div>

                <table className={s.metaTable}>
                    <tbody>
                        <tr>
                            <td className={s.metaLabel}>Бөлім:</td>
                            <td>{lesson_info.section || '—'}</td>
                        </tr>
                        <tr>
                            <td className={s.metaLabel}>Педагогтің аты-жөні:</td>
                            <td className={s.metaBlank}>___________________</td>
                        </tr>
                        <tr>
                            <td className={s.metaLabel}>Күні:</td>
                            <td className={s.metaBlank}>___________________</td>
                        </tr>
                        <tr>
                            <td className={s.metaLabel}>Сынып:</td>
                            <td>{meta.grade}</td>
                        </tr>
                        <tr>
                            <td className={s.metaLabel}>Қатысқандар саны:</td>
                            <td className={s.metaBlank}>________&nbsp;&nbsp;&nbsp;&nbsp;Қатыспағандар саны: ________</td>
                        </tr>
                        <tr>
                            <td className={s.metaLabel}>Сабақтың тақырыбы:</td>
                            <td className={s.topicCell}>{meta.topic}</td>
                        </tr>
                    </tbody>
                </table>

                <QMJLessonInfoBlock info={lesson_info} />
                <QMJStagesBlock stages={stages} />
                <QMJDifferentiationBlock differentiation={differentiation} />
                <QMJReflectionBlock reflection={reflection} />
                <QMJHomeworkBlock homework={homework} />
            </article>
        </div>
    );
};
