import type { ImageBlock } from '@/shared/api/lessonApi';
import { getFileUrl } from '@/shared/lib/fileUrl';
import s from '../LessonPageLayout/LessonPageLayout.module.scss';

interface Props {
    block: ImageBlock;
}

export const LessonImage = ({ block }: Props) => {
    return (
        <figure className={s.imageBlock}>
            <img
                src={getFileUrl(block.url)}
                alt={block.caption || ''}
                className={s.image}
            />
            {block.caption && (
                <figcaption className={s.imageCaption}>{block.caption}</figcaption>
            )}
        </figure>
    );
};
