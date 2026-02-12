import type { LoginFormData } from '@/entities/user'
import { getCurrentUser } from '@/entities/user/api/userApi'
import { useAuthStore } from '@/entities/user/model/store/useAuthStore'
import { loginUser } from '@/features/auth/api/loginApi'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { PasswordInput } from '@/shared/ui/password-input'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginForm } from '../../../model/useLoginForm'
import s from './LoginForm.module.scss'

export const LoginForm = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { setTokens, setUser } = useAuthStore()

	const {
		register,
		handleIinChange,
		onSubmit,
		formState: { errors, isSubmitting }
	} = useLoginForm(async (data: LoginFormData) => {
		try {
			const response = await loginUser(data)

			setTokens(response.access_token, response.refresh_token)

			const userData = await getCurrentUser()

			setUser({
				id: userData.id,
				iin: userData.iin,
				name: userData.name,
				phoneNumber: userData.phone,
				is_superuser: userData.is_superuser
			})

			navigate('/')
			toast.success(t('auth.loginSuccess'))
		} catch (error) {
			console.error('Login error:', error)

			if (axios.isAxiosError(error)) {
				const message =
					error.response?.data?.detail ||
					error.response?.data?.message ||
					t('auth.wrongCredentials')
				toast.error(message)
			} else if (error instanceof Error) {
				toast.error(error.message)
			} else {
				toast.error(t('auth.loginError'))
			}
		}
	})

	return (
		<>
			<form
				className={s.form}
				onSubmit={onSubmit}
			>
				<h3 className={s.title}>{t('auth.welcome')}</h3>
				<p className={s.subtitle}>
					{t('auth.loginSubtitle')}
				</p>

				<div className={s.inputsWrapper}>
					<Input
						{...register('iin')}
						id="iin"
						label={t('auth.iin')}
						error={errors.iin?.message}
						inputMode="text"
						maxLength={12}
						placeholder={t('auth.iinPlaceholder')}
						autoFocus
						onChange={handleIinChange}
					/>

					<PasswordInput
						{...register('password')}
						id="password"
						label={t('auth.password')}
						error={errors.password?.message}
						placeholder={t('auth.passwordPlaceholder')}
					/>
				</div>

				<div className={s.rememberAndForgot}>
					<label className={s.rememberRow}>
						<input
							type="checkbox"
							className={s.checkbox}
						/>
						<span className={s.rememberText}>{t('auth.rememberMe')}</span>
					</label>
					<Link
						to="/reset-password"
						className={s.forgotPasswordLink}
					>
						{t('auth.forgotPassword')}
					</Link>
				</div>

				<Button
					type="submit"
					disabled={isSubmitting}
					loading={isSubmitting}
					fullWidth
					className={s.submitBtn}
				>
					{t('auth.loginBtn')}
				</Button>
			</form>

			<div className={s.register}>
				<p> {t('auth.noAccount')} </p>
				<Link
					className={s.registerLink}
					to="/register"
				>
					{t('auth.registerLink')}
				</Link>
			</div>
		</>
	)
}
