import { forwardRef } from 'react';
import { clsx } from 'clsx';
import s from './Input.module.scss';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, id, ...props }, ref) => {
        return (
            <div className={s.field}>
                {label && (
                    <label
                        htmlFor={id}
                        className={clsx(s.label, error && s.errorLabel)}>
                        {error || label}
                    </label>
                )}
                <input
                    {...props}
                    ref={ref}
                    id={id}
                    className={clsx(s.input, error && s.errorInput, className)}
                />
            </div>
        );
    }
);

Input.displayName = 'Input';
