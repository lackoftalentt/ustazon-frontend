import { Link } from 'react-router';
import s from './NavigationCard.module.scss';

import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react';
import type { ComponentType } from 'react';

interface NavigationCardProps {
    icon: ComponentType<{ className?: string }>;
    title: string;
    to: string;
}

export const NavigationCard = ({
    icon: StartIcon,
    title,
    to
}: NavigationCardProps) => {
    return (
        <div className={s.navigationCard}>
            <StartIcon className={s.leftIcon} />
            <h3 className={s.title}>{title}</h3>
            <Link
                className={s.link}
                to={to}>
                Перейти
                <ArrowIcon className={s.arrow} />
            </Link>
        </div>
    );
};
