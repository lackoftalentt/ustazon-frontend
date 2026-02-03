import type { QMJLessonInfo } from '@/shared/api/qmjAiApi';
import s from './blocks.module.scss';

interface Props {
    info: QMJLessonInfo;
}

export const QMJLessonInfoBlock = ({ info }: Props) => (
    <section className={s.section}>
        <h3 className={s.sectionTitle}>Сабақ туралы ақпарат</h3>

        <table className={s.infoTable}>
            <tbody>
                <tr>
                    <td className={s.label}>Пән</td>
                    <td>{info.subject}</td>
                </tr>
                <tr>
                    <td className={s.label}>Тақырып</td>
                    <td>{info.topic}</td>
                </tr>
                <tr>
                    <td className={s.label}>Сынып</td>
                    <td>{info.grade}</td>
                </tr>
                <tr>
                    <td className={s.label}>Ұзақтығы</td>
                    <td>{info.duration} мин</td>
                </tr>
                <tr>
                    <td className={s.label}>Оқу мақсаттары</td>
                    <td>
                        <ul className={s.list}>
                            {info.learning_objectives.map((obj, i) => (
                                <li key={i}>{obj}</li>
                            ))}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td className={s.label}>Сабақ мақсаттары</td>
                    <td>
                        <ul className={s.list}>
                            {info.lesson_objectives.map((obj, i) => (
                                <li key={i}>{obj}</li>
                            ))}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td className={s.label}>Бағалау критерийлері</td>
                    <td>
                        <ul className={s.list}>
                            {info.assessment_criteria.map((c, i) => (
                                <li key={i}>{c}</li>
                            ))}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td className={s.label}>Құндылықтар</td>
                    <td>{info.values}</td>
                </tr>
                <tr>
                    <td className={s.label}>Пәнаралық байланыс</td>
                    <td>{info.cross_curricular_links}</td>
                </tr>
                <tr>
                    <td className={s.label}>Алдыңғы білім</td>
                    <td>{info.prior_knowledge}</td>
                </tr>
                <tr>
                    <td className={s.label}>Ресурстар</td>
                    <td>
                        <ul className={s.list}>
                            {info.resources.map((r, i) => (
                                <li key={i}>{r}</li>
                            ))}
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
);
