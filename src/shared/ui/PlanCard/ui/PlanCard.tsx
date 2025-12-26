import clsx from 'clsx';
import s from './PlanCard.module.scss';

type Props = {
    title: string;
    kmzhCount: number | string;
    lessonsCount: number | string;
    className?: string;
    onDetails?: () => void;
};

export const PlanCard = ({
    title,
    kmzhCount,
    lessonsCount,
    className,
    onDetails
}: Props) => {
    return (
        <article className={clsx(s.card, className)}>
            <h3 className={s.title}>{title}</h3>

            <div className={s.meta}>
                <div className={s.metaItem}>
                    {/* <KmzhIcon
                        className={s.metaIcon}
                        aria-hidden="true"
                    /> */}
                    <span className={s.metaText}>{kmzhCount} КМЖ</span>
                </div>

                <div className={s.metaItem}>
                    {/* <LessonsIcon
                        className={s.metaIcon}
                        aria-hidden="true"
                    /> */}
                    <span className={s.metaText}>{lessonsCount} КМЖ</span>
                </div>
            </div>

            <button
                type="button"
                className={s.button}
                onClick={onDetails}>
                Подробнее
            </button>
        </article>
    );
};
