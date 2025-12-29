import type { ReactNode } from 'react';
import s from './LessonPlanCard.module.scss';

type Props = {
    title: string;
    countLabel: string;
    children: ReactNode;
};

export const LessonPlanCard = ({ title, countLabel, children }: Props) => {
    return (
        <section className={s.card}>
            <header className={s.header}>
                <div className={s.left}>
                    {/* сюда потом поставишь иконку календаря */}
                    <div className={s.iconPlaceholder} />
                    <h2 className={s.title}>{title}</h2>
                </div>

                <div className={s.badge}>{countLabel}</div>
            </header>

            <div className={s.body}>{children}</div>
        </section>
    );
};
