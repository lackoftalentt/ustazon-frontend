import { Link } from 'react-router-dom';
import s from './NavigationCard.module.scss';

import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react';
import type { ComponentType } from 'react';

interface NavigationCardProps {
    icon: ComponentType<{ className?: string }>;
    title: string;
    path: string;
}

export const NavigationCard = ({
    icon: StartIcon,
    title,
    path
}: NavigationCardProps) => {
    return (
        <div className={s.navigationCard}>
            <StartIcon className={s.leftIcon} />
            <h3 className={s.title}>{title}</h3>
            <Link
                className={s.link}
                to={path}>
                Перейти
                <ArrowIcon className={s.arrow} />
            </Link>
        </div>
    );
};
