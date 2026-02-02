import type { OpenQuestionBlock } from '@/shared/api/lessonApi';
import s from '../LessonPageLayout/LessonPageLayout.module.scss';

interface Props {
    block: OpenQuestionBlock;
    index: number;
}

export const LessonOpenQuestion = ({ block, index }: Props) => {
    return (
        <div className={s.openQuestionBlock}>
            <p className={s.openQuestionText}>
                {index}. {block.question}
            </p>
            <div className={s.openQuestionLines}>
                <div className={s.answerLine} />
                <div className={s.answerLine} />
                <div className={s.answerLine} />
            </div>
        </div>
    );
};
