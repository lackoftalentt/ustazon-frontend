import type { ResetPasswordFormData } from '@/entities/user'
import { resetPassword } from '@/features/auth/api/resetPasswordApi'
import ArrowLeft from '@/shared/assets/icons/arrowLeft.svg?react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { PasswordInput } from '@/shared/ui/password-input'
import axios from 'axios'
import clsx from 'clsx'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useResetPasswordForm } from '../../../model/useResetPasswordForm'
import s from './ResetPasswordForm.module.scss'

type Step = 'phone' | 'code' | 'newPassword'

export const ResetPasswordForm = () => {
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
				console.log('Phone from form:', data.phoneNumber)
				toast.success('Код нөміріңізге жіберілді')
				setStep('code')
			} else if (step === 'code') {
				if (!data.code) {
					toast.error('Кодты енгізіңіз')
					return
				}
				toast.success('Код расталды!')
				setStep('newPassword')
			} else if (step === 'newPassword') {
				const isValid = await trigger(['newPassword', 'confirmPassword'])

				if (!isValid) {
					toast.error('Формадағы қателерді түзетіңіз')
					return
				}

				if (!data.newPassword || !data.confirmPassword) {
					toast.error('Барлық өрістерді толтырыңыз')
					return
				}

				const resetData = {
					phone: data.phoneNumber,
					code: data.code || '',
					new_password: data.newPassword,
					confirm_password: data.confirmPassword
				}

				console.log('=== FINAL RESET DATA ===')
				console.log('Phone:', resetData.phone)
				console.log('Code:', resetData.code)
				console.log('Password:', resetData.new_password)
				console.log('Confirm:', resetData.confirm_password)

				await resetPassword(resetData)
				navigate('/login')
				toast.success('Құпиясөз сәтті өзгертілді!')
			}
		} catch (error) {
			console.error('Reset newPassword error:', error)
			if (axios.isAxiosError(error)) {
				console.log(
					'Error response:',
					JSON.stringify(error.response?.data, null, 2)
				)
				console.log('Error status:', error.response?.status)
			}

			const errorMessages = {
				phone: 'Кодты жіберу мүмкін болмады',
				code: 'Қате код',
				newPassword: 'Құпиясөзді өзгерту мүмкін болмады'
			}
			toast.error(errorMessages[step])
		}
	})

	const getTitle = () => {
		switch (step) {
			case 'phone':
			case 'code':
				return 'Құпиясөзді қалпына келтіру'
			case 'newPassword':
				return 'Жаңа құпиясөз'
		}
	}

	const getSubtitle = () => {
		switch (step) {
			case 'phone':
				return 'Құпиясөзді қалпына келтіру үшін деректерді толтырыңыз'
			case 'code':
				return 'SMS-тен келген кодты енгізіңіз'
			case 'newPassword':
				return 'Жаңа құпиясөз ойлап табыңыз'
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
						label="Телефон нөмірі"
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
							label="Код"
							error={errors.code?.message}
							type="text"
							inputMode="numeric"
							placeholder="Кодты енгізіңіз"
							autoFocus
						/>
					</div>
				)}

				{step === 'newPassword' && (
					<>
						<PasswordInput
							{...register('newPassword')}
							id="newPassword"
							label="Жаңа құпиясөз"
							error={errors.newPassword?.message}
							placeholder="Жаңа құпиясөз енгізіңіз"
							autoFocus
						/>
						<div className={s.resetPasswordInput}>
							<Input
								{...register('confirmPassword')}
								id="confirmPassword"
								label="Құпиясөзді растаңыз"
								error={errors.confirmPassword?.message}
								type="password"
								placeholder="Құпиясөзді қайталаңыз"
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
						? 'Сақтау'
						: step === 'code'
							? 'Растау'
							: 'Әрі қарай'}
				</Button>
			</form>

			<div className={s.back}>
				<ArrowLeft className={s.arrowLeft} />

				<Link
					className={s.backLink}
					to={'/login'}
				>
					Қайту
				</Link>
			</div>
		</>
	)
}
