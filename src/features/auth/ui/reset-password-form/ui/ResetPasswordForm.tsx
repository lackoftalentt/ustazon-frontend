import { Button, Input } from '@/shared/ui';
import { useResetPasswordForm } from '../../../model/useResetPasswordForm';
import s from './ResetPasswordForm.module.scss';
import type { ResetPasswordFormData } from '@/entities/user';
import { Link } from 'react-router';
import arrowLeft from '@/shared/assets/icons/arrowLeft.svg';

export const ResetPasswordForm = () => {
    const {
        register,
        handlePhoneChange,
        onSubmit,
        formState: { errors, isSubmitting }
    } = useResetPasswordForm((data: ResetPasswordFormData) => {
        console.log('Valid data:', data);
        // Здесь будет логика отправки на сервер
    });

    return (
        <>
            <form
                className={s.form}
                onSubmit={onSubmit}>
                <h3 className={s.title}>Восстановить пароль</h3>
                <p className={s.subtitle}>
                    Заполните данные для восстановления пароля
                </p>

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
                    fullWidth
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    type="submit"
                    className={s.thenBtn}>
                    Далее
                </Button>
            </form>

            <div className={s.back}>
                <img
                    className={s.arrowLeft}
                    src={arrowLeft}
                    alt=""
                />
                <Link
                    className={s.backLink}
                    to={'/login'}>
                    Вернуться
                </Link>
            </div>
        </>
    );
};
