import type { VocabularyBlock } from '@/shared/api/lessonApi';
import s from '../LessonPageLayout/LessonPageLayout.module.scss';

interface Props {
    block: VocabularyBlock;
}

export const LessonVocabulary = ({ block }: Props) => {
    return (
        <div className={s.vocabularyBlock}>
            <h3 className={s.vocabularyTitle}>Глоссарий</h3>
            <table className={s.vocabularyTable}>
                <thead>
                    <tr>
                        <th>Термин</th>
                        <th>Анықтама</th>
                    </tr>
                </thead>
                <tbody>
                    {block.items.map((item, i) => (
                        <tr key={i}>
                            <td className={s.vocabularyTerm}>{item.term}</td>
                            <td>{item.definition}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
