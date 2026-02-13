import { registerUser } from '@/features/auth/api/registerApi'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { PasswordInput } from '@/shared/ui/password-input'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRegisterForm } from '../../../model/useRegisterForm'
import s from './RegisterForm.module.scss'

export const RegisterForm = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const location = useLocation()

	const prefillIin = (location.state as { iin?: string })?.iin || ''

	const {
		register,
		handleIinChange,
		handlePhoneChange,
		onSubmit,
		formState: { errors, isSubmitting }
	} = useRegisterForm(async data => {
		try {
			await registerUser(data)
			toast.success(t('auth.registerSuccess'))
			navigate('/login')
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message =
					error.response?.data?.detail ||
					error.response?.data?.message ||
					t('auth.registerError')
				toast.error(message)
			} else if (error instanceof Error) {
				toast.error(error.message)
			} else {
				toast.error(t('auth.unknownError'))
			}
		}
	}, prefillIin)

	return (
		<>
			<form
				className={s.form}
				onSubmit={onSubmit}
			>
				<h3 className={s.title}>{t('auth.registerTitle')}</h3>
				<p className={s.subtitle}>
					{t('auth.registerSubtitle')}
				</p>

				<div className={s.inputsWrapper}>
					<Input
						{...register('iin')}
						id="iin"
						label={t('auth.iin')}
						error={errors.iin?.message}
						inputMode="numeric"
						maxLength={12}
						placeholder={t('auth.iinPlaceholder')}
						onChange={handleIinChange}
						disabled={!!prefillIin}
					/>

					<Input
						{...register('name')}
						id="name"
						label={t('auth.name')}
						error={errors.name?.message}
						type="text"
						placeholder={t('auth.namePlaceholder')}
						autoFocus={!!prefillIin}
					/>

					<PasswordInput
						{...register('password')}
						id="password"
						label={t('auth.password')}
						error={errors.password?.message}
						placeholder={t('auth.passwordPlaceholder')}
					/>

					<Input
						{...register('confirmPassword')}
						id="passwordConfirm"
						label={t('auth.confirmPassword')}
						error={errors.confirmPassword?.message}
						placeholder={t('auth.confirmPasswordPlaceholder')}
						type="password"
					/>

					<Input
						{...register('phoneNumber')}
						id="phoneNumber"
						label={t('auth.phone')}
						error={errors.phoneNumber?.message}
						type="tel"
						inputMode="tel"
						placeholder="+7 (7XX) XXX-XX-XX"
						onChange={handlePhoneChange}
					/>
				</div>

				<Button
					type="submit"
					disabled={isSubmitting}
					loading={isSubmitting}
					fullWidth
					className={s.submitButton}
				>
					{t('auth.registerBtn')}
				</Button>
			</form>

			<div className={s.login}>
				<p>{t('auth.hasAccount')}</p>
				<Link
					className={s.loginLink}
					to="/login"
				>
					{t('auth.loginLink')}
				</Link>
			</div>
		</>
	)
}
