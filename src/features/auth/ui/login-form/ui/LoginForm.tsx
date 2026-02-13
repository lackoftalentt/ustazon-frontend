import type { LoginFormData } from '@/entities/user'
import { getCurrentUser } from '@/entities/user/api/userApi'
import { useAuthStore } from '@/entities/user/model/store/useAuthStore'
import { checkIinExists, loginUser } from '@/features/auth/api/loginApi'
import { formatNumericInput } from '@/features/auth/lib/formatters'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { PasswordInput } from '@/shared/ui/password-input'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { iinSchema, loginSchema } from '@/entities/user'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import s from './LoginForm.module.scss'

type Step = 'iin' | 'password'

export const LoginForm = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const location = useLocation()
	const { setTokens, setUser } = useAuthStore()
	const [step, setStep] = useState<Step>('iin')
	const [isChecking, setIsChecking] = useState(false)
	const [iinError, setIinError] = useState<string | undefined>()

	const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors, isSubmitting }
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange'
	})

	const handleIinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formatted = formatNumericInput(e.target.value, 12)
		setValue('iin', formatted, { shouldValidate: false })
		if (iinError) setIinError(undefined)
	}

	const handleIinStep = async () => {
		const iin = getValues('iin')
		const result = iinSchema.safeParse({ iin })
		if (!result.success) {
			setIinError(result.error.issues[0]?.message)
			return
		}
		setIinError(undefined)

		setIsChecking(true)
		try {
			const exists = await checkIinExists(iin)
			if (exists) {
				setStep('password')
			} else {
				toast(t('auth.iinNotFound'), { icon: '👋' })
				navigate('/register', { state: { iin } })
			}
		} catch {
			toast.error(t('auth.loginError'))
		} finally {
			setIsChecking(false)
		}
	}

	const handleLogin = async (data: LoginFormData) => {
		try {
			const response = await loginUser(data)

			setTokens(response.access_token, response.refresh_token)

			const userData = await getCurrentUser()

			setUser({
				id: userData.id,
				iin: userData.iin,
				name: userData.name,
				phoneNumber: userData.phone,
				is_admin: userData.is_admin,
				is_superuser: userData.is_superuser
			})

			navigate(from, { replace: true })
			toast.success(t('auth.loginSuccess'))
		} catch (error) {
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
	}

	const onSubmit = step === 'iin'
		? (e: React.FormEvent) => { e.preventDefault(); handleIinStep() }
		: handleSubmit(handleLogin)

	return (
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
					error={iinError || errors.iin?.message}
					inputMode="numeric"
					maxLength={12}
					placeholder={t('auth.iinPlaceholder')}
					autoFocus
					onChange={handleIinChange}
					disabled={step === 'password'}
				/>

				{step === 'password' && (
					<PasswordInput
						{...register('password')}
						id="password"
						label={t('auth.password')}
						error={errors.password?.message}
						placeholder={t('auth.passwordPlaceholder')}
						autoFocus
					/>
				)}
			</div>

			{step === 'password' && (
				<div className={s.forgotRow}>
					<button
						type="button"
						className={s.changeIinLink}
						onClick={() => setStep('iin')}
					>
						{t('auth.changeIin')}
					</button>
					<Link
						to="/reset-password"
						className={s.forgotPasswordLink}
					>
						{t('auth.forgotPassword')}
					</Link>
				</div>
			)}

			<Button
				type="submit"
				disabled={isSubmitting || isChecking}
				loading={isSubmitting || isChecking}
				fullWidth
				className={s.submitBtn}
			>
				{step === 'iin' ? t('auth.next') : t('auth.loginBtn')}
			</Button>
		</form>
	)
}
