import { Button } from '@/shared/ui/button';
import s from './SubjectCard.module.scss';
import Arrow from '@/shared/assets/icons/arrowLeft.svg?react';
import { Link } from 'react-router-dom';

interface SubjectCardProps {
    id?: string | number;
    title: string;
    description?: string;
    thumbnail?: string;
    thumbnailAlt?: string;
    path?: string;
}

export const SubjectCard = ({
    // id,
    title,
    description,
    thumbnail,
    thumbnailAlt = 'Subject thumbnail',
    path = '/subject'
}: SubjectCardProps) => {
    return (
        <article className={s.card}>
            <div className={s.thumbnail}>
                {thumbnail && (
                    <img
                        src={thumbnail}
                        alt={thumbnailAlt}
                        className={s.thumbnailImage}
                    />
                )}
            </div>
            <div className={s.container}>
                <h3 className={s.title}>{title}</h3>
                <p className={s.description}>{description}</p>
                <Link
                    to={path}
                    className={s.link}>
                    <Button className={s.button}>
                        Перейти
                        <Arrow className={s.arrowIcon} />
                    </Button>
                </Link>
            </div>
        </article>
    );
};
