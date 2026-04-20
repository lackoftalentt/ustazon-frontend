import type { QMJLessonInfo } from '@/shared/api/qmjAiApi';
import s from './blocks.module.scss';

interface Props {
    info: QMJLessonInfo;
}

export const QMJLessonInfoBlock = ({ info }: Props) => {
    const valuesEd = info.values_education;

    return (
        <section className={s.section}>
            <table className={s.infoTable}>
                <tbody>
                    <tr>
                        <td className={s.label}>Оқу бағдарламасына сәйкес оқыту мақсаттары:</td>
                        <td>
                            <ul className={s.list}>
                                {info.learning_objectives.map((obj, i) => (
                                    <li key={i}>{obj}</li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td className={s.label}>Сабақтың мақсаты:</td>
                        <td>
                            <ul className={s.list}>
                                {info.lesson_objectives.map((obj, i) => (
                                    <li key={i}>{obj}</li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td className={s.label}>Бағалау критерийлері:</td>
                        <td>
                            <ul className={s.list}>
                                {info.assessment_criteria.map((c, i) => (
                                    <li key={i}>{c}</li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td className={s.label}>Құндылыққа баулу:</td>
                        <td>
                            {valuesEd ? (
                                <div className={s.valuesBlock}>
                                    <div className={s.valueName}>
                                        Құндылық: {valuesEd.value_name}
                                    </div>
                                    {valuesEd.value_description && (
                                        <p className={s.valueDescription}>
                                            {valuesEd.value_description}
                                        </p>
                                    )}
                                    {valuesEd.value_sentences?.length > 0 && (
                                        <ul className={s.list}>
                                            {valuesEd.value_sentences.map((sentence, i) => (
                                                <li key={i}>{sentence}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <span>{info.values || '—'}</span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className={s.label}>Пәнаралық байланыс:</td>
                        <td>{info.cross_curricular_links}</td>
                    </tr>
                    <tr>
                        <td className={s.label}>Алдыңғы білім:</td>
                        <td>{info.prior_knowledge}</td>
                    </tr>
                    <tr>
                        <td className={s.label}>Ресурстар:</td>
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
};
