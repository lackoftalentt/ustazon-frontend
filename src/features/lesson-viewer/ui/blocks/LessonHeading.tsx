import type { HeadingBlock } from '@/shared/api/lessonApi';
import s from '../LessonPageLayout/LessonPageLayout.module.scss';

interface Props {
    block: HeadingBlock;
}

export const LessonHeading = ({ block }: Props) => {
    const Tag = `h${Math.min(block.level, 3)}` as 'h1' | 'h2' | 'h3';
    return <Tag className={s.heading}>{block.text}</Tag>;
};
