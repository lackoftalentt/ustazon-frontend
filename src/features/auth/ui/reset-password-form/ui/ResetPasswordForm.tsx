import { Button, Input } from '@/shared/ui';
import { useResetPasswordForm } from '../../../model/useResetPasswordForm';
import s from './ResetPasswordForm.module.scss';
import type { ResetPasswordFormData } from '@/entities/user';
import { Link } from 'react-router';
import arrowLeft from '@/shared/assets/icons/arrowLeft.svg';
import toast from 'react-hot-toast';
import { useState } from 'react';
import clsx from 'clsx';

export const ResetPasswordForm = () => {
    const [codeSent, setCodeSent] = useState(false);

    const {
        register,
        handlePhoneChange,
        onSubmit,
        formState: { errors, isSubmitting }
    } = useResetPasswordForm(async (data: ResetPasswordFormData) => {
        try {
            if (!codeSent) {
                // await sendCodeToPhone(data.phoneNumber);
                toast.success('Код отправлен на ваш номер');
                setCodeSent(true);
            } else {
                if (!data.code) {
                    toast.error('Введите код');
                    return;
                }
                // await verifyCode(data.phoneNumber, data.code);
                toast.success('Код подтвержден!');
            }
        } catch (error) {
            toast.error(codeSent ? 'Неверный код' : 'Не удалось отправить код');
        }
    });

    return (
        <>
            <form
                className={s.form}
                onSubmit={onSubmit}>
                <h3 className={s.title}>Восстановить пароль</h3>
                <p className={clsx(s.subtitle, codeSent && s.subtitleChanged)}>
                    {codeSent
                        ? 'Введите код из СМС'
                        : 'Заполните данные для восстановления пароля'}
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
                    disabled={codeSent}
                />

                {codeSent && (
                    <div className={s.codeInput}>
                        <Input
                            {...register('code')}
                            id="code"
                            label="Код"
                            error={errors.code?.message}
                            type="text"
                            inputMode="numeric"
                            placeholder="Введите код"
                            autoFocus
                        />
                    </div>
                )}

                <Button
                    fullWidth
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    type="submit"
                    className={s.thenBtn}>
                    {codeSent ? 'Подтвердить' : 'Далее'}
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
