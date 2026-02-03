import type { QMJDifferentiation } from '@/shared/api/qmjAiApi';
import s from './blocks.module.scss';

interface Props {
    differentiation: QMJDifferentiation;
}

export const QMJDifferentiationBlock = ({ differentiation }: Props) => (
    <section className={s.section}>
        <h3 className={s.sectionTitle}>Дифференциация</h3>

        <table className={s.infoTable}>
            <tbody>
                <tr>
                    <td className={s.label}>Қолдау (нашар оқушылар)</td>
                    <td>{differentiation.support}</td>
                </tr>
                <tr>
                    <td className={s.label}>Кеңейту (күшті оқушылар)</td>
                    <td>{differentiation.extension}</td>
                </tr>
                <tr>
                    <td className={s.label}>Оқу жетістіктерін бағалау</td>
                    <td>{differentiation.assessment_of_learning}</td>
                </tr>
            </tbody>
        </table>
    </section>
);
