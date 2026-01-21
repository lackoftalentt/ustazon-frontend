import type { LoginFormData } from '@/entities/user'
import { getCurrentUser } from '@/entities/user/api/userApi'
import { useAuthStore } from '@/entities/user/model/store/useAuthStore'
import { loginUser } from '@/features/auth/api/loginApi'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { PasswordInput } from '@/shared/ui/password-input'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useLoginForm } from '../../../model/useLoginForm'
import s from './LoginForm.module.scss'

export const LoginForm = () => {
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
				iin: userData.iin,
				name: userData.name,
				phoneNumber: userData.phone
			})

			navigate('/')
			toast.success('Кіру сәтті орындалды!')
		} catch (error) {
			console.error('Login error:', error)

			if (axios.isAxiosError(error)) {
				const message =
					error.response?.data?.detail ||
					error.response?.data?.message ||
					'Қате ИИН немесе құпиясөз'
				toast.error(message)
			} else if (error instanceof Error) {
				toast.error(error.message)
			} else {
				toast.error('Кіру кезінде қате орын алды')
			}
		}
	})

	return (
		<>
			<form
				className={s.form}
				onSubmit={onSubmit}
			>
				<h3 className={s.title}>Қош келдіңіз</h3>
				<p className={s.subtitle}>
					Жеке есепке кіру үшін деректерді толтырыңыз
				</p>

				<div className={s.inputsWrapper}>
					<Input
						{...register('iin')}
						id="iin"
						label="ЖСН"
						error={errors.iin?.message}
						inputMode="text"
						maxLength={12}
						placeholder="ЖСН енгізіңіз"
						autoFocus
						onChange={handleIinChange}
					/>

					<PasswordInput
						{...register('password')}
						id="password"
						label="Құпиясөз"
						error={errors.password?.message}
						placeholder="Құпиясөз енгізіңіз"
					/>
				</div>

				<div className={s.rememberAndForgot}>
					<label className={s.rememberRow}>
						<input
							type="checkbox"
							className={s.checkbox}
						/>
						<span className={s.rememberText}>Есте сақтау</span>
					</label>
					<Link
						to="/reset-password"
						className={s.forgotPasswordLink}
					>
						Құпиясөзді ұмыттыңыз ба?
					</Link>
				</div>

				<Button
					type="submit"
					disabled={isSubmitting}
					loading={isSubmitting}
					fullWidth
					className={s.submitBtn}
				>
					Кіру
				</Button>
			</form>

			<div className={s.register}>
				<p> Тіркелмегенсіз бе? </p>
				<Link
					className={s.registerLink}
					to="/register"
				>
					Тіркелу.
				</Link>
			</div>
		</>
	)
}
