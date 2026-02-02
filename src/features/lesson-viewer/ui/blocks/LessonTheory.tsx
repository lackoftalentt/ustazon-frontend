import type { TheoryBlock } from '@/shared/api/lessonApi';
import s from '../LessonPageLayout/LessonPageLayout.module.scss';

interface Props {
    block: TheoryBlock;
}

export const LessonTheory = ({ block }: Props) => {
    return (
        <div className={s.theoryBlock}>
            {block.sections.map((section, i) => (
                <div key={i} className={s.theorySection}>
                    <h3 className={s.theorySectionTitle}>{section.title}</h3>
                    {section.content.split('\n').map((paragraph, j) => (
                        paragraph.trim() && (
                            <p key={j} className={s.theoryParagraph}>{paragraph}</p>
                        )
                    ))}
                </div>
            ))}
        </div>
    );
};
