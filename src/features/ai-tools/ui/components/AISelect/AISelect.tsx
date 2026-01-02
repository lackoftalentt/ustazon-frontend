import type { SelectHTMLAttributes } from 'react';
import s from './AISelect.module.scss';

interface AISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    wrapperClassName?: string;
    options?: { value: string | number; label: string }[];
}

export const AISelect = ({
    label,
    options,
    children,
    className = '',
    wrapperClassName = '',
    ...props
}: AISelectProps) => {
    return (
        <div className={`${s.wrapper} ${wrapperClassName}`}>
            {label && <label className={s.label}>{label}</label>}
            <div className={s.selectWrapper}>
                <select
                    className={`${s.select} ${className}`}
                    {...props}
                >
                    {children}
                    {options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
