import clsx from 'clsx';
import s from './StatCounter.module.scss';

type Props = {
    value: number | string;
    label: string;
    className?: string;
};

export const StatCounter = ({ value, label, className }: Props) => {
    return (
        <div className={clsx(s.card, className)}>
            <div className={s.value}>{value}</div>
            <div className={s.label}>{label}</div>
        </div>
    );
};
