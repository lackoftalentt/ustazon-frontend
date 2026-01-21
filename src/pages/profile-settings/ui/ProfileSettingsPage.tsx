import { getCurrentUser, updateUserProfile } from '@/entities/user/api/userApi'
import { useAuthStore } from '@/entities/user/model/store/useAuthStore'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import s from './ProfileSettingsPage.module.scss'

const profileSchema = z.object({
	name: z
		.string()
		.min(2, 'Аты кемінде 2 таңбадан тұруы тиіс')
		.max(50, 'Аты 50 таңбадан аспауы тиіс')
		.regex(
			/^[а-яА-ЯёЁa-zA-Z\s\-]+$/,
			'Аты тек әріптерден, бос орындардан және сызықшадан тұра алады'
		),
	phone: z
		.string()
		.regex(/^\+?7\d{10}$/, 'Телефон нөмірінің форматы қате')
		.transform(val => (val.startsWith('+') ? val : `+${val}`))
})

type ProfileFormData = z.infer<typeof profileSchema>

export const ProfileSettingsPage = () => {
	const [isEditing, setIsEditing] = useState(false)
	const navigate = useNavigate()
	const { setUser, logout } = useAuthStore()
	const queryClient = useQueryClient()

	const { data: userData, isLoading } = useQuery({
		queryKey: ['currentUser'],
		queryFn: getCurrentUser
	})

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isDirty }
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		values: userData
			? {
					name: userData.name,
					phone: userData.phone
				}
			: undefined
	})

	const updateMutation = useMutation({
		mutationFn: updateUserProfile,
		onSuccess: data => {
			queryClient.setQueryData(['currentUser'], data)
			setUser({
				iin: data.iin,
				name: data.name,
				phoneNumber: data.phone
			})
			setIsEditing(false)
			toast.success('Профиль сәтті жаңартылды')
		},
		onError: (error: any) => {
			const message =
				error.response?.data?.detail || 'Профильді жаңарту кезінде қате болды'
			toast.error(message)
		}
	})

	const onSubmit = (data: ProfileFormData) => {
		updateMutation.mutate(data)
	}

	const handleCancel = () => {
		reset()
		setIsEditing(false)
	}

	const handleLogout = () => {
		logout()
		toast.success('Сіз аккаунттан шықтыңыз')
		navigate('/login')
	}

	if (isLoading) {
		return (
			<div className={s.container}>
				<div className={s.card}>
					<p>Жүктелуде...</p>
				</div>
			</div>
		)
	}

	if (!userData) {
		return (
			<div className={s.container}>
				<div className={s.card}>
					<p>Профиль деректерін жүктеу мүмкін болмады</p>
				</div>
			</div>
		)
	}

	return (
		<div className={s.container}>
			<div className={s.header}>
				<div className={s.headerContent}>
					<div>
						<h1 className={s.title}>Профиль</h1>
						<p className={s.subtitle}>
							Жеке деректерді және параметрлерді басқарыңыз
						</p>
					</div>
					<div className={s.avatarSection}>
						<div className={s.avatarCircle}>
							{userData?.name.charAt(0).toUpperCase()}
						</div>
					</div>
				</div>
			</div>

			<div className={s.card}>
				<form
					className={s.form}
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className={s.formRow}>
						<Input
							{...register('name')}
							id="name"
							label="Аты"
							error={errors.name?.message}
							placeholder="Атыңызды енгізіңіз"
							disabled={!isEditing}
						/>

						<Input
							{...register('phone')}
							id="phone"
							label="Телефон нөмірі"
							error={errors.phone?.message}
							placeholder="+7XXXXXXXXXX"
							disabled={!isEditing}
						/>
					</div>

					{!isEditing ? (
						<Button
							type="button"
							onClick={() => setIsEditing(true)}
							fullWidth
						>
							Профильді өңдеу
						</Button>
					) : (
						<div className={s.buttonGroup}>
							<Button
								type="submit"
								disabled={!isDirty || updateMutation.isPending}
								loading={updateMutation.isPending}
								fullWidth
							>
								Өзгерістерді сақтау
							</Button>
							<Button
								type="button"
								onClick={handleCancel}
								className={s.cancelButton}
								fullWidth
							>
								Болдырмау
							</Button>
						</div>
					)}
				</form>

				<div className={s.infoSection}>
					<h2 className={s.infoTitle}>Аккаунт туралы ақпарат</h2>
					<div className={s.infoGrid}>
						<div className={s.infoItem}>
							<span className={s.infoLabel}>ЖСН</span>
							<span className={s.infoValue}>{userData.iin}</span>
						</div>
						<div className={s.infoItem}>
							<span className={s.infoLabel}>Телефон статусы</span>
							{userData.is_verified ? (
								<span className={s.verifiedBadge}>✓ Расталған</span>
							) : (
								<span className={s.unverifiedBadge}>! Расталмаған</span>
							)}
						</div>
						<div className={s.infoItem}>
							<span className={s.infoLabel}>Тіркелу күні</span>
							<span className={s.infoValue}>
								{new Date(userData.created_at).toLocaleDateString('kk-KZ', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</span>
						</div>
					</div>
				</div>

				<div className={s.dangerZone}>
					<h2 className={s.dangerTitle}>Аккаунтты басқару</h2>
					<div className={s.dangerContent}>
						<div>
							<p className={s.dangerText}>Аккаунттан шығу</p>
							<p className={s.dangerDescription}>
								Сіз кіру бетіне қайта бағытталасыз
							</p>
						</div>
						<Button
							onClick={handleLogout}
							className={s.logoutButton}
							variant="outline"
						>
							Шығу
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
