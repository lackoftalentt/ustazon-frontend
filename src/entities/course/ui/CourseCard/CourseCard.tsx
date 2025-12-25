import { Button } from '@/shared/ui/Button';
import s from './CourseCard.module.scss';
import Arrow from '@/shared/assets/icons/arrowLeft.svg?react';
import { Link } from 'react-router';

interface CourseCardProps {
    id?: string | number;
    title: string;
    description?: string;
    thumbnail?: string;
    thumbnailAlt?: string;
    path?: string;
}

export const CourseCard = ({
    // id,
    title,
    description,
    thumbnail,
    thumbnailAlt = 'Course thumbnail',
    path = '/course'
}: CourseCardProps) => {
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
