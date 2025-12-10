import { Button } from '@/shared/ui/Button';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { Input } from '@/shared/ui/Input';
import { useResetPasswordForm } from '../../../model/useResetPasswordForm';
import s from './ResetPasswordForm.module.scss';
import type { ResetPasswordFormData } from '@/entities/user';
import { Link, useNavigate } from 'react-router';
import arrowLeft from '@/shared/assets/icons/arrowLeft.svg';
import toast from 'react-hot-toast';
import { useState } from 'react';
import clsx from 'clsx';

type Step = 'phone' | 'code' | 'password';

export const ResetPasswordForm = () => {
    const [step, setStep] = useState<Step>('phone');
    const navigate = useNavigate();

    const {
        register,
        handlePhoneChange,
        onSubmit,
        formState: { errors, isSubmitting },
        trigger
    } = useResetPasswordForm(async (data: ResetPasswordFormData) => {
        try {
            if (step === 'phone') {
                // await sendCodeToPhone(data.phoneNumber);
                toast.success('Код отправлен на ваш номер');
                setStep('code');
            } else if (step === 'code') {
                if (!data.code) {
                    toast.error('Введите код');
                    return;
                }
                // await verifyCode(data.phoneNumber, data.code);
                toast.success('Код подтвержден!');
                setStep('password');
            } else if (step === 'password') {
                const isValid = await trigger(['password', 'confirmPassword']);

                if (!isValid) {
                    toast.error('Пожалуйста, исправьте ошибки в форме');
                    return;
                }

                if (!data.password || !data.confirmPassword) {
                    toast.error('Заполните все поля');
                    return;
                }

                // await resetPassword(data.phoneNumber, data.password);
                navigate('/login');
                toast.success('Пароль успешно изменен!');
            }
        } catch (error) {
            const errorMessages = {
                phone: 'Не удалось отправить код',
                code: 'Неверный код',
                password: 'Не удалось изменить пароль'
            };
            toast.error(errorMessages[step]);
        }
    });

    const getTitle = () => {
        switch (step) {
            case 'phone':
                return 'Восстановить пароль';
            case 'code':
                return 'Восстановить пароль';
            case 'password':
                return 'Новый пароль';
        }
    };

    const getSubtitle = () => {
        switch (step) {
            case 'phone':
                return 'Заполните данные для восстановления пароля';
            case 'code':
                return 'Введите код из СМС';
            case 'password':
                return 'Придумайте новый пароль';
        }
    };

    return (
        <>
            <form
                className={s.form}
                onSubmit={onSubmit}>
                <h3 className={s.title}>{getTitle()}</h3>
                <p
                    className={clsx(
                        s.subtitle,
                        step !== 'phone' && s.subtitleChanged
                    )}>
                    {getSubtitle()}
                </p>

                {(step === 'phone' || step === 'code') && (
                    <Input
                        {...register('phoneNumber')}
                        id="phoneNumber"
                        label="Номер телефона"
                        error={errors.phoneNumber?.message}
                        type="tel"
                        inputMode="tel"
                        placeholder="+7 (7XX) XXX-XX-XX"
                        onChange={handlePhoneChange}
                        disabled={step === 'code'}
                    />
                )}

                {step === 'code' && (
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

                {step === 'password' && (
                    <>
                        <PasswordInput
                            {...register('password')}
                            id="password"
                            label="Новый пароль"
                            error={errors.password?.message}
                            placeholder="Введите новый пароль"
                            autoFocus
                        />
                        <Input
                            {...register('confirmPassword')}
                            id="confirmPassword"
                            label="Подтвердите пароль"
                            error={errors.confirmPassword?.message}
                            type="password"
                            placeholder="Повторите пароль"
                        />
                    </>
                )}

                <Button
                    fullWidth
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    type="submit"
                    className={s.thenBtn}>
                    {step === 'password'
                        ? 'Сохранить'
                        : step === 'code'
                        ? 'Подтвердить'
                        : 'Далее'}
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
