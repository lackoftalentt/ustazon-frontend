import { Link, useNavigate } from 'react-router';
import { Button } from '@/shared/ui/Button';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { Input } from '@/shared/ui/Input';
import { useRegisterForm } from '../../../model/useRegisterForm';
import s from './RegisterForm.module.scss';
import toast from 'react-hot-toast';
import { registerUser } from '@/features/auth/api/registerApi';

export const RegisterForm = () => {
    const navigate = useNavigate();

    const {
        register,
        handleIinChange,
        handlePhoneChange,
        onSubmit,
        formState: { errors, isSubmitting }
    } = useRegisterForm(async data => {
        try {
            await registerUser(data);
            console.log('Valid data:', data);
            toast.success('Регистрация прошла успешно!');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);

            if (error instanceof Error) {
                toast.error(error.message);
            } else if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error
            ) {
                const apiError = error as {
                    response?: { data?: { message?: string } };
                };
                toast.error(
                    apiError.response?.data?.message || 'Ошибка при регистрации'
                );
            } else {
                toast.error('Произошла неизвестная ошибка');
            }
        }
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
                    {...register('confirmPassword')}
                    id="passwordConfirm"
                    label="Подтвердите пароль"
                    error={errors.confirmPassword?.message}
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
