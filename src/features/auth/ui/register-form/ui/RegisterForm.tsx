import { registerUser } from '@/features/auth/api/registerApi'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { PasswordInput } from '@/shared/ui/password-input'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterForm } from '../../../model/useRegisterForm'
import s from './RegisterForm.module.scss'

export const RegisterForm = () => {
	const navigate = useNavigate()

	const {
		register,
		handleIinChange,
		handlePhoneChange,
		onSubmit,
		formState: { errors, isSubmitting }
	} = useRegisterForm(async data => {
		try {
			await registerUser(data)
			console.log('Valid data:', data)
			toast.success('Тіркелу сәтті өтті!')
			navigate('/login')
		} catch (error) {
			console.error('Registration error:', error)

			if (error instanceof Error) {
				toast.error(error.message)
			} else if (
				typeof error === 'object' &&
				error !== null &&
				'response' in error
			) {
				const apiError = error as {
					response?: { data?: { message?: string } }
				}
				toast.error(
					apiError.response?.data?.message || 'Тіркелу барысында қате болды'
				)
			} else {
				toast.error('Белгісіз қате орын алды')
			}
		}
	})

	return (
		<>
			<form
				className={s.form}
				onSubmit={onSubmit}
			>
				<h3 className={s.title}>Тіркелу</h3>
				<p className={s.subtitle}>
					Аккаунтны тіркеу үшін деректерді толтырыңыз
				</p>

				<div className={s.inputsWrapper}>
					<Input
						{...register('iin')}
						id="iin"
						label="ЖСН"
						error={errors.iin?.message}
						inputMode="numeric"
						maxLength={12}
						placeholder="ЖСН енгізіңіз"
						onChange={handleIinChange}
					/>

					<Input
						{...register('name')}
						id="name"
						label="Аты"
						error={errors.name?.message}
						type="text"
						placeholder="Атыңызды енгізіңіз"
					/>

					<PasswordInput
						{...register('password')}
						id="password"
						label="Құпиясөз"
						error={errors.password?.message}
						placeholder="Құпиясөз енгізіңіз"
					/>

					<Input
						{...register('confirmPassword')}
						id="passwordConfirm"
						label="Құпиясөзді растаңыз"
						error={errors.confirmPassword?.message}
						placeholder="Құпиясөзді растаңыз"
						type="password"
					/>

					<Input
						{...register('phoneNumber')}
						id="phoneNumber"
						label="Телефон нөмірі"
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
					Тіркелу
				</Button>
			</form>

			<div className={s.login}>
				<p>Бұрын тіркелгенсіз бе?</p>
				<Link
					className={s.loginLink}
					to="/login"
				>
					Кіру.
				</Link>
			</div>
		</>
	)
}
