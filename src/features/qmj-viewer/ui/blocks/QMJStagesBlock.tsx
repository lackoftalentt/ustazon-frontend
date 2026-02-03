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
                    <th>Кезең</th>
                    <th>Уақыт</th>
                    <th>Мұғалім әрекеттері</th>
                    <th>Оқушы әрекеттері</th>
                    <th>Бағалау</th>
                    <th>Ресурстар</th>
                </tr>
            </thead>
            <tbody>
                {stages.map((stage, i) => (
                    <tr key={i}>
                        <td className={s.stageName}>
                            <div>{stage.name}</div>
                            <div className={s.stageNameRu}>{stage.name_ru}</div>
                        </td>
                        <td className={s.stageDuration}>{stage.duration} мин</td>
                        <td>{stage.teacher_activities}</td>
                        <td>{stage.student_activities}</td>
                        <td>{stage.assessment}</td>
                        <td>{stage.resources}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </section>
);
