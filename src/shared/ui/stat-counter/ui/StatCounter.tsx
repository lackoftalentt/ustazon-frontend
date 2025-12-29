import clsx from 'clsx';
import s from './StatCounter.module.scss';

type Props = {
    value: number | string;
    label: string;
    className?: string;
    icon?: React.ReactNode;
};

export const StatCounter = ({ value, label, className, icon }: Props) => {
    return (
        <div className={clsx(s.card, className)}>
            {icon && <div className={s.iconWrapper}>{icon}</div>}
            <div className={s.content}>
                <div className={s.value}>{value}</div>
                <div className={s.label}>{label}</div>
            </div>
        </div>
    );
};
