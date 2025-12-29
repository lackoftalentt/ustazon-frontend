import { Button } from '@/shared/ui/button';
import { PasswordInput } from '@/shared/ui/password-input';
import { Input } from '@/shared/ui/input';
import { useResetPasswordForm } from '../../../model/useResetPasswordForm';
import s from './ResetPasswordForm.module.scss';
import type { ResetPasswordFormData } from '@/entities/user';
import { Link, useNavigate } from 'react-router-dom';
import ArrowLeft from '@/shared/assets/icons/arrowLeft.svg?react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import clsx from 'clsx';
import {
    resetPassword,
    sendResetCode,
    verifyResetCode
} from '@/features/auth/api/resetPasswordApi';
import axios from 'axios';

type Step = 'phone' | 'code' | 'newPassword';

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
                console.log('Phone from form:', data.phoneNumber);
                await sendResetCode({ phone: data.phoneNumber });
                toast.success('Код отправлен на ваш номер');
                setStep('code');
            } else if (step === 'code') {
                if (!data.code) {
                    toast.error('Введите код');
                    return;
                }
                // await verifyResetCode({
                //     phone: data.phoneNumber,
                //     code: data.code
                // });
                toast.success('Код подтвержден!');
                setStep('newPassword');
            } else if (step === 'newPassword') {
                const isValid = await trigger([
                    'newPassword',
                    'confirmPassword'
                ]);

                if (!isValid) {
                    toast.error('Пожалуйста, исправьте ошибки в форме');
                    return;
                }

                if (!data.newPassword || !data.confirmPassword) {
                    toast.error('Заполните все поля');
                    return;
                }

                const resetData = {
                    phone: data.phoneNumber,
                    code: data.code || '',
                    new_password: data.newPassword,
                    confirm_password: data.confirmPassword
                };

                console.log('=== FINAL RESET DATA ===');
                console.log('Phone:', resetData.phone);
                console.log('Code:', resetData.code);
                console.log('Password:', resetData.new_password);
                console.log('Confirm:', resetData.confirm_password);

                await resetPassword(resetData);
                navigate('/login');
                toast.success('Пароль успешно изменен!');
            }
        } catch (error) {
            console.error('Reset newPassword error:', error);
            if (axios.isAxiosError(error)) {
                console.log(
                    'Error response:',
                    JSON.stringify(error.response?.data, null, 2)
                );
                console.log('Error status:', error.response?.status);
            }

            const errorMessages = {
                phone: 'Не удалось отправить код',
                code: 'Неверный код',
                newPassword: 'Не удалось изменить пароль'
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
            case 'newPassword':
                return 'Новый пароль';
        }
    };

    const getSubtitle = () => {
        switch (step) {
            case 'phone':
                return 'Заполните данные для восстановления пароля';
            case 'code':
                return 'Введите код из СМС';
            case 'newPassword':
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

                {step === 'newPassword' && (
                    <>
                        <PasswordInput
                            {...register('newPassword')}
                            id="newPassword"
                            label="Новый пароль"
                            error={errors.newPassword?.message}
                            placeholder="Введите новый пароль"
                            autoFocus
                        />
                        <Input
                            {...register('confirmPassword')}
                            id="confirmPassword"
                            label="Подтвердите пароль"
                            error={errors.confirmPassword?.message}
                            type="newPassword"
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
                    {step === 'newPassword'
                        ? 'Сохранить'
                        : step === 'code'
                        ? 'Подтвердить'
                        : 'Далее'}
                </Button>
            </form>

            <div className={s.back}>
                <ArrowLeft className={s.arrowLeft} />

                <Link
                    className={s.backLink}
                    to={'/login'}>
                    Вернуться
                </Link>
            </div>
        </>
    );
};
