import type { QMJStage } from '@/shared/api/qmjAiApi';
import s from './blocks.module.scss';

interface Props {
    stages: QMJStage[];
}

export const QMJStagesBlock = ({ stages }: Props) => (
    <section className={s.section}>
        <h3 className={s.sectionTitle}>Сабақ кезеңдері</h3>

        <table className={s.stagesTable}>
            <thead>
                <tr>
                    <th>Уақыты / кезеңдері</th>
                    <th>Педагогтің әрекеті</th>
                    <th>Оқушының әрекеті</th>
                    <th>Бағалау</th>
                    <th>Ресурстар</th>
                </tr>
            </thead>
            <tbody>
                {stages.map((stage, i) => {
                    // Stage with exercises (Сабақтың ортасы)
                    if (stage.exercises && stage.exercises.length > 0) {
                        return stage.exercises.map((exercise, j) => (
                            <tr key={`${i}-${j}`}>
                                {j === 0 && (
                                    <td className={s.stageName} rowSpan={stage.exercises!.length}>
                                        <div>{stage.name}</div>
                                        <div className={s.stageNameRu}>{stage.name_ru}</div>
                                        <div className={s.stageDuration}>{stage.duration} мин</div>
                                    </td>
                                )}
                                <td>
                                    <div className={s.exerciseHeader}>
                                        {exercise.number}
                                    </div>
                                    <div className={s.exerciseText}>
                                        {exercise.text}
                                    </div>
                                    {exercise.work_type && (
                                        <div className={s.exerciseWorkType}>
                                            Жұмыс түрі: {exercise.work_type}
                                        </div>
                                    )}
                                    {exercise.descriptors.length > 0 && (
                                        <div className={s.descriptorsBlock}>
                                            <div className={s.descriptorsTitle}>Дескриптор:</div>
                                            <ul className={s.descriptorsList}>
                                                {exercise.descriptors.map((d, k) => (
                                                    <li key={k}>{d}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <div className={s.exerciseText}>
                                        {exercise.text}
                                    </div>
                                </td>
                                <td>
                                    <div className={s.assessmentMethod}>
                                        {exercise.assessment_method}
                                    </div>
                                </td>
                                <td>{exercise.resources || '—'}</td>
                            </tr>
                        ));
                    }

                    // Regular stage (beginning, end, organizational)
                    return (
                        <tr key={i}>
                            <td className={s.stageName}>
                                <div>{stage.name}</div>
                                <div className={s.stageNameRu}>{stage.name_ru}</div>
                                <div className={s.stageDuration}>{stage.duration} мин</div>
                            </td>
                            <td>
                                {stage.work_type && (
                                    <div className={s.exerciseWorkType}>
                                        Жұмыс түрі: {stage.work_type}
                                    </div>
                                )}
                                {stage.method && (
                                    <div className={s.exerciseWorkType}>
                                        Әдіс: {stage.method}
                                    </div>
                                )}
                                <div>{stage.teacher_activities}</div>
                            </td>
                            <td>{stage.student_activities}</td>
                            <td>{stage.assessment}</td>
                            <td>{stage.resources}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </section>
);
