import type { ButtonHTMLAttributes, ReactNode } from 'react';
import s from './AIButton.module.scss';

interface AIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: ReactNode;
    loading?: boolean;
    fullWidth?: boolean;
}

export const AIButton = ({
    children,
    variant = 'primary',
    icon,
    loading,
    fullWidth,
    className = '',
    disabled,
    ...props
}: AIButtonProps) => {
    return (
        <button
            className={`
                ${s.button} 
                ${s[variant]} 
                ${fullWidth ? s.fullWidth : ''} 
                ${loading ? s.loading : ''} 
                ${className}
            `}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className={s.spinner} />
            ) : (
                <>
                    {icon && <span className={s.icon}>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};
