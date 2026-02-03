import type { QMJReflection } from '@/shared/api/qmjAiApi';
import s from './blocks.module.scss';

interface Props {
    reflection: QMJReflection;
}

export const QMJReflectionBlock = ({ reflection }: Props) => (
    <section className={s.section}>
        <h3 className={s.sectionTitle}>Рефлексия</h3>

        <ul className={s.list}>
            {reflection.questions.map((q, i) => (
                <li key={i}>{q}</li>
            ))}
        </ul>
    </section>
);
