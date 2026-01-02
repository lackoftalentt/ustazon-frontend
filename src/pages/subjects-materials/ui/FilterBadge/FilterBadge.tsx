import { Link } from 'react-router-dom';
import s from './FilterBadge.module.scss';

interface FilterBadgeProps {
    label: string;
    resetLink: string;
    variant?: 'topic' | 'window';
}

export const FilterBadge = ({
    label,
    resetLink,
    variant = 'topic'
}: FilterBadgeProps) => {
    return (
        <div className={`${s.badge} ${s[variant]}`}>
            <span className={s.label}>{label}</span>
            <Link to={resetLink} className={s.resetLink}>
                Сбросить фильтр
            </Link>
        </div>
    );
};
