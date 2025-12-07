import { Link } from 'react-router';
import { Button, Input, PasswordInput } from '@/shared/ui';
import { useRegisterForm } from '../../../model/useRegisterForm';
import s from './RegisterForm.module.scss';

export const RegisterForm = () => {
    const {
        register,
        handleIinChange,
        handlePhoneChange,
        onSubmit,
        formState: { errors, isSubmitting }
    } = useRegisterForm(data => {
        console.log('Valid data:', data);
    });

    return (
        <>
            <form
                className={s.form}
                onSubmit={onSubmit}>
                <h3 className={s.title}>Регистрация</h3>
                <p className={s.subtitle}>
                    Заполните данные для регистрации учетной записи
                </p>

                <Input
                    {...register('iin')}
                    id="iin"
                    label="ИИН"
                    error={errors.iin?.message}
                    inputMode="numeric"
                    maxLength={12}
                    placeholder="Введите ИИН"
                    onChange={handleIinChange}
                />

                <Input
                    {...register('name')}
                    id="name"
                    label="Имя"
                    error={errors.name?.message}
                    type="text"
                    placeholder="Введите ваше имя"
                />

                <PasswordInput
                    {...register('password')}
                    id="password"
                    label="Пароль"
                    error={errors.password?.message}
                    placeholder="Введите пароль"
                />

                <Input
                    {...register('passwordConfirm')}
                    id="passwordConfirm"
                    label="Подтвердите пароль"
                    error={errors.passwordConfirm?.message}
                    placeholder="Подтвердите пароль"
                    type="password"
                />

                <Input
                    {...register('phoneNumber')}
                    id="phoneNumber"
                    label="Номер телефона"
                    error={errors.phoneNumber?.message}
                    type="tel"
                    inputMode="tel"
                    placeholder="+7 (7XX) XXX-XX-XX"
                    onChange={handlePhoneChange}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    fullWidth
                    className={s.submitButton}>
                    Регистрация
                </Button>
            </form>

            <div className={s.login}>
                <p>Уже есть учетная запись?</p>
                <Link
                    className={s.loginLink}
                    to="/login">
                    Войти
                </Link>
            </div>
        </>
    );
};
