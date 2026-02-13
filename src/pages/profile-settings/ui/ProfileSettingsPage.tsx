import { getCurrentUser, updateUserProfile } from '@/entities/user/api/userApi'
import { useAuthStore } from '@/entities/user/model/store/useAuthStore'
import { LoaderPage } from '@/pages/loader-page'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import type { TFunction } from 'i18next'
import s from './ProfileSettingsPage.module.scss'

const createProfileSchema = (t: TFunction) =>
	z.object({
		name: z
			.string()
			.min(2, t('profile.nameMinLength'))
			.max(50, t('profile.nameMaxLength'))
			.regex(
				/^[а-яА-ЯёЁa-zA-Z\s\-]+$/,
				t('profile.nameFormat')
			),
		phone: z
			.string()
			.regex(/^\+?7\d{10}$/, t('profile.phoneFormat'))
			.transform(val => (val.startsWith('+') ? val : `+${val}`))
	})

type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>

export const ProfileSettingsPage = () => {
	const { t } = useTranslation()
	const [isEditing, setIsEditing] = useState(false)
	const navigate = useNavigate()
	const { setUser, logout } = useAuthStore()
	const queryClient = useQueryClient()
	const profileSchema = createProfileSchema(t)

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
				id: data.id,
				iin: data.iin,
				name: data.name,
				phoneNumber: data.phone,
				is_superuser: data.is_superuser
			})
			setIsEditing(false)
			toast.success(t('profile.profileUpdated'))
		},
		onError: (error: any) => {
			const message =
				error.response?.data?.detail || t('profile.profileUpdateError')
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
		queryClient.clear()
		toast.success(t('profile.loggedOut'))
		navigate('/login')
	}

	if (isLoading) {
		return <LoaderPage />
	}

	if (!userData) {
		return (
			<div className={s.container}>
				<div className={s.card}>
					<p>{t('profile.loadFailed')}</p>
				</div>
			</div>
		)
	}

	return (
		<div className={s.container}>
			<div className={s.header}>
				<div className={s.headerContent}>
					<div>
						<h1 className={s.title}>{t('profile.profileTitle')}</h1>
						<p className={s.subtitle}>
							{t('profile.profileSubtitle')}
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
							label={t('profile.nameLabel')}
							error={errors.name?.message}
							placeholder={t('profile.namePlaceholder')}
							disabled={!isEditing}
						/>

						<Input
							{...register('phone')}
							id="phone"
							label={t('profile.phoneLabel')}
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
							{t('profile.editProfile')}
						</Button>
					) : (
						<div className={s.buttonGroup}>
							<Button
								type="submit"
								disabled={!isDirty || updateMutation.isPending}
								loading={updateMutation.isPending}
								fullWidth
							>
								{t('profile.saveChanges')}
							</Button>
							<Button
								type="button"
								onClick={handleCancel}
								className={s.cancelButton}
								fullWidth
							>
								{t('profile.cancelEdit')}
							</Button>
						</div>
					)}
				</form>

				<div className={s.infoSection}>
					<h2 className={s.infoTitle}>{t('profile.accountInfo')}</h2>
					<div className={s.infoGrid}>
						<div className={s.infoItem}>
							<span className={s.infoLabel}>{t('profile.iinLabel')}</span>
							<span className={s.infoValue}>{userData.iin}</span>
						</div>
						<div className={s.infoItem}>
							<span className={s.infoLabel}>{t('profile.phoneStatus')}</span>
							{userData.is_verified ? (
								<span className={s.verifiedBadge}>{t('profile.verified')}</span>
							) : (
								<span className={s.unverifiedBadge}>{t('profile.notVerified')}</span>
							)}
						</div>
						<div className={s.infoItem}>
							<span className={s.infoLabel}>{t('profile.registrationDate')}</span>
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
					<h2 className={s.dangerTitle}>{t('profile.accountManagement')}</h2>
					<div className={s.dangerContent}>
						<div>
							<p className={s.dangerText}>{t('profile.logoutLabel')}</p>
							<p className={s.dangerDescription}>
								{t('profile.logoutDescription')}
							</p>
						</div>
						<Button
							onClick={handleLogout}
							className={s.logoutButton}
							variant="outline"
						>
							{t('profile.logoutBtn')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
