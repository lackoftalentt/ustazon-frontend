import { Link } from 'react-router';
import { Button, Input, PasswordInput } from '@/shared/ui';
import { useLoginForm } from '../../../model/useLoginForm';
import type { LoginFormData } from '@/entities/user';
import s from './LoginForm.module.scss';

export const LoginForm = () => {
    const {
        register,
        handleIinChange,
        onSubmit,
        formState: { errors, isSubmitting }
    } = useLoginForm((data: LoginFormData) => {
        console.log('Valid data:', data);
    });

    return (
        <>
            <form
                className={s.form}
                onSubmit={onSubmit}>
                <h3 className={s.title}>Добро пожаловать</h3>
                <p className={s.subtitle}>
                    Заполните данные для входа в учетную запись
                </p>

                <Input
                    {...register('iin')}
                    id="iin"
                    label="ИИН"
                    error={errors.iin?.message}
                    inputMode="numeric"
                    maxLength={12}
                    placeholder="Введите ИИН"
                    autoFocus
                    onChange={handleIinChange}
                />

                <PasswordInput
                    {...register('password')}
                    id="password"
                    label="Пароль"
                    error={errors.password?.message}
                    placeholder="Введите пароль"
                />

                <div className={s.rememberAndForgot}>
                    <label className={s.rememberRow}>
                        <input
                            type="checkbox"
                            className={s.checkbox}
                        />
                        <span className={s.rememberText}>Запомнить меня</span>
                    </label>
                    <Link
                        to="/reset-password"
                        className={s.forgotPasswordLink}>
                        Забыли пароль?
                    </Link>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    fullWidth
                    className={s.submitBtn}>
                    Войти
                </Button>
            </form>

            <div className={s.register}>
                <p>Нет учетной записи?</p>
                <Link
                    className={s.registerLink}
                    to="/register">
                    Зарегистрироваться
                </Link>
            </div>
        </>
    );
};
