import type { QMJHomework } from '@/shared/api/qmjAiApi';
import s from './blocks.module.scss';

interface Props {
    homework: QMJHomework;
}

export const QMJHomeworkBlock = ({ homework }: Props) => (
    <section className={s.section}>
        <h3 className={s.sectionTitle}>Үй тапсырмасы</h3>

        <p className={s.paragraph}>{homework.description}</p>

        <ul className={s.list}>
            {homework.tasks.map((task, i) => (
                <li key={i}>{task}</li>
            ))}
        </ul>
    </section>
);
