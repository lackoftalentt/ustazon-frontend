import type { ResetPasswordFormData } from '@/entities/user'
import { resetPassword, sendResetCode, verifyResetCode } from '@/features/auth/api/resetPasswordApi'
import ArrowLeft from '@/shared/assets/icons/arrowLeft.svg?react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { PasswordInput } from '@/shared/ui/password-input'
import axios from 'axios'
import clsx from 'clsx'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useResetPasswordForm } from '../../../model/useResetPasswordForm'
import s from './ResetPasswordForm.module.scss'

type Step = 'phone' | 'code' | 'newPassword'

export const ResetPasswordForm = () => {
	const { t } = useTranslation()
	const [step, setStep] = useState<Step>('phone')
	const navigate = useNavigate()

	const {
		register,
		handlePhoneChange,
		onSubmit,
		formState: { errors, isSubmitting },
		trigger
	} = useResetPasswordForm(async (data: ResetPasswordFormData) => {
		try {
			if (step === 'phone') {
				await sendResetCode({ phone: data.phoneNumber })
				toast.success(t('auth.codeSent'))
				setStep('code')
			} else if (step === 'code') {
				if (!data.code) {
					toast.error(t('auth.enterCode'))
					return
				}
				await verifyResetCode({
					phone: data.phoneNumber,
					code: data.code
				})
				toast.success(t('auth.codeConfirmed'))
				setStep('newPassword')
			} else if (step === 'newPassword') {
				const isValid = await trigger(['newPassword', 'confirmPassword'])

				if (!isValid) {
					toast.error(t('auth.fixFormErrors'))
					return
				}

				if (!data.newPassword || !data.confirmPassword) {
					toast.error(t('auth.fillAllFields'))
					return
				}

				await resetPassword({
					phone: data.phoneNumber,
					code: data.code || '',
					new_password: data.newPassword,
					confirm_password: data.confirmPassword
				})
				toast.success(t('auth.passwordChanged'))
				navigate('/login')
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message =
					error.response?.data?.detail ||
					error.response?.data?.message
				if (message) {
					toast.error(message)
					return
				}
			}

			const errorMessages = {
				phone: t('auth.codeSendFailed'),
				code: t('auth.wrongCode'),
				newPassword: t('auth.passwordChangeFailed')
			}
			toast.error(errorMessages[step])
		}
	})

	const getTitle = () => {
		switch (step) {
			case 'phone':
			case 'code':
				return t('auth.resetTitle')
			case 'newPassword':
				return t('auth.newPassword')
		}
	}

	const getSubtitle = () => {
		switch (step) {
			case 'phone':
				return t('auth.resetSubtitle')
			case 'code':
				return t('auth.enterSmsCode')
			case 'newPassword':
				return t('auth.newPasswordSubtitle')
		}
	}

	return (
		<>
			<form
				className={s.form}
				onSubmit={onSubmit}
			>
				<h3 className={s.title}>{getTitle()}</h3>
				<p className={clsx(s.subtitle, step !== 'phone' && s.subtitleChanged)}>
					{getSubtitle()}
				</p>

				{(step === 'phone' || step === 'code') && (
					<Input
						{...register('phoneNumber')}
						id="phoneNumber"
						label={t('auth.phone')}
						error={errors.phoneNumber?.message}
						type="tel"
						inputMode="tel"
						placeholder="+7 (7XX) XXX-XX-XX"
						onChange={handlePhoneChange}
						disabled={step === 'code'}
						className={s.input}
					/>
				)}

				{step === 'code' && (
					<div className={s.codeInput}>
						<Input
							{...register('code')}
							id="code"
							label={t('auth.code')}
							error={errors.code?.message}
							type="text"
							inputMode="numeric"
							placeholder={t('auth.codePlaceholder')}
							autoFocus
						/>
					</div>
				)}

				{step === 'newPassword' && (
					<>
						<PasswordInput
							{...register('newPassword')}
							id="newPassword"
							label={t('auth.newPassword')}
							error={errors.newPassword?.message}
							placeholder={t('auth.newPasswordPlaceholder')}
							autoFocus
						/>
						<div className={s.resetPasswordInput}>
							<Input
								{...register('confirmPassword')}
								id="confirmPassword"
								label={t('auth.confirmPassword')}
								error={errors.confirmPassword?.message}
								type="password"
								placeholder={t('auth.repeatPassword')}
							/>
						</div>
					</>
				)}

				<Button
					fullWidth
					loading={isSubmitting}
					disabled={isSubmitting}
					type="submit"
					className={s.thenBtn}
				>
					{step === 'newPassword'
						? t('auth.save')
						: step === 'code'
							? t('auth.confirm')
							: t('auth.next')}
				</Button>
			</form>

			<div className={s.back}>
				<ArrowLeft className={s.arrowLeft} />

				<Link
					className={s.backLink}
					to={'/login'}
				>
					{t('auth.backToLogin')}
				</Link>
			</div>
		</>
	)
}
