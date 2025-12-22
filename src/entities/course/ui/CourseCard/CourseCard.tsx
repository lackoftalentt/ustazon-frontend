import { Button } from '@/shared/ui/Button';
import s from './CourseCard.module.scss';
import Arrow from '@/shared/assets/icons/arrowLeft.svg?react';
import { useNavigate } from 'react-router';

interface CourseCardProps {
    id?: string | number;
    title: string;
    description?: string;
    thumbnail?: string;
    thumbnailAlt?: string;
}

export const CourseCard = ({
    id,
    title,
    description,
    thumbnail,
    thumbnailAlt = 'Course thumbnail'
}: CourseCardProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/course`);
    };

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
                <Button
                    onClick={handleClick}
                    className={s.button}>
                    Перейти
                    <Arrow className={s.arrowIcon} />
                </Button>
            </div>
        </article>
    );
};
