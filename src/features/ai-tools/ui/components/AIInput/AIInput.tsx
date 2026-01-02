import type { InputHTMLAttributes, ReactNode } from 'react';
import s from './AIInput.module.scss';

interface AIInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
    wrapperClassName?: string;
}

export const AIInput = ({
    label,
    icon,
    className = '',
    wrapperClassName = '',
    ...props
}: AIInputProps) => {
    return (
        <div className={`${s.wrapper} ${wrapperClassName}`}>
            {label && <label className={s.label}>{label}</label>}
            <div className={s.inputWrapper}>
                {icon && <div className={s.icon}>{icon}</div>}
                <input
                    className={`${s.input} ${icon ? s.hasIcon : ''} ${className}`}
                    {...props}
                />
            </div>
        </div>
    );
};
