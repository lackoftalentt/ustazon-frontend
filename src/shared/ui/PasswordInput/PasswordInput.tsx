import { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import s from './PasswordInput.module.scss';
import eye from '@/shared/assets/icons/eye.svg';
import blockEye from '@/shared/assets/icons/blockEye.svg';

interface PasswordInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ label, error, className, id, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className={s.field}>
                {label && (
                    <label
                        htmlFor={id}
                        className={clsx(s.label, error && s.errorLabel)}>
                        {error || label}
                    </label>
                )}
                <div className={s.wrapper}>
                    <input
                        {...props}
                        ref={ref}
                        id={id}
                        type={showPassword ? 'text' : 'password'}
                        className={clsx(
                            s.input,
                            error && s.errorInput,
                            className
                        )}
                    />
                    <button
                        type="button"
                        className={s.eyeButton}
                        onClick={() => setShowPassword(prev => !prev)}
                        aria-label={
                            showPassword ? 'Скрыть пароль' : 'Показать пароль'
                        }>
                        <img
                            src={showPassword ? blockEye : eye}
                            alt=""
                        />
                    </button>
                </div>
            </div>
        );
    }
);
