import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Navigate } from 'react-router-dom'

import { useAuthStore } from '@/entities/user'
import { subscriptionApi } from '@/entities/subscription/api/subscriptionApi'
import type { Subscription, SubscriptionCreate } from '@/entities/subscription/model/types'
import { subjectApi, type Subject, type InstitutionType } from '@/entities/subject/api/subjectApi'

import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { SectionTitle } from '@/shared/ui/section-title'
import { Modal } from '@/shared/ui/modal'
import { ConfirmModal } from '@/shared/ui/confirm-modal'
import { Loader } from '@/shared/ui/loader'
import s from './SubscriptionsPage.module.scss'

type FilterMode = 'all' | 'active' | 'expired' | 'expiring'

export const SubscriptionsPage = () => {
	const { t } = useTranslation()
	const { isAdmin } = useAuthStore()
	const queryClient = useQueryClient()

	if (!isAdmin()) return <Navigate to="/" replace />

	const [filter, setFilter] = useState<FilterMode>('all')
	const [modalOpen, setModalOpen] = useState(false)
	const [deleteItem, setDeleteItem] = useState<Subscription | null>(null)
	const [form, setForm] = useState<SubscriptionCreate>({
		user_id: 0,
		subject_id: 0,
		institution_type_id: 0,
		end_date: '',
	})

	const { data: allSubs = [], isLoading: loadingAll } = useQuery({
		queryKey: ['subscriptions-all'],
		queryFn: () => subscriptionApi.getSubscriptions({ limit: 1000 }),
	})

	const { data: expiredSubs = [], isLoading: loadingExpired } = useQuery({
		queryKey: ['subscriptions-expired'],
		queryFn: () => subscriptionApi.getExpiredSubscriptions({ limit: 1000 }),
		enabled: filter === 'expired',
	})

	const { data: expiringSubs = [], isLoading: loadingExpiring } = useQuery({
		queryKey: ['subscriptions-expiring'],
		queryFn: () => subscriptionApi.getExpiringSoonSubscriptions({ days: 7, limit: 1000 }),
		enabled: filter === 'expiring',
	})

	const { data: subjects = [] } = useQuery({
		queryKey: ['subjects'],
		queryFn: () => subjectApi.getSubjects({ limit: 1000 }),
	})

	const { data: institutionTypes = [] } = useQuery({
		queryKey: ['institution-types'],
		queryFn: () => subjectApi.getInstitutionTypes({ limit: 1000 }),
	})

	const createMutation = useMutation({
		mutationFn: (data: SubscriptionCreate) => subscriptionApi.createSubscription(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscriptions-all'] })
			toast.success(t('admin.created'))
			setModalOpen(false)
		},
		onError: () => toast.error(t('admin.createError')),
	})

	const deleteMutation = useMutation({
		mutationFn: (id: number) => subscriptionApi.deleteSubscription(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscriptions-all'] })
			queryClient.invalidateQueries({ queryKey: ['subscriptions-expired'] })
			queryClient.invalidateQueries({ queryKey: ['subscriptions-expiring'] })
			toast.success(t('admin.deleted'))
			setDeleteItem(null)
		},
		onError: () => toast.error(t('admin.deleteError')),
	})

	const displayed = useMemo(() => {
		switch (filter) {
			case 'active':
				return allSubs.filter(s => s.is_active)
			case 'expired':
				return expiredSubs
			case 'expiring':
				return expiringSubs
			default:
				return allSubs
		}
	}, [filter, allSubs, expiredSubs, expiringSubs])

	const openCreate = () => {
		setForm({
			user_id: 0,
			subject_id: subjects[0]?.id || 0,
			institution_type_id: institutionTypes[0]?.id || 0,
			end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
		})
		setModalOpen(true)
	}

	const handleSubmit = () => {
		if (!form.user_id || !form.subject_id || !form.institution_type_id || !form.end_date) {
			toast.error(t('admin.fillRequired'))
			return
		}
		createMutation.mutate(form)
	}

	const loading = loadingAll || (filter === 'expired' && loadingExpired) || (filter === 'expiring' && loadingExpiring)

	return (
		<main className={s.page}>
			<Container>
				<div className={s.header}>
					<SectionTitle title={t('admin.tabs.subscriptions')} />
					<div className={s.toolbar}>
						<div className={s.filters}>
							{(['all', 'active', 'expired', 'expiring'] as FilterMode[]).map(mode => (
								<button
									key={mode}
									className={`${s.filterBtn} ${filter === mode ? s.filterBtnActive : ''}`}
									onClick={() => setFilter(mode)}>
									{t(`admin.subFilters.${mode}`)}
								</button>
							))}
						</div>
						<Button size="sm" onClick={openCreate}>
							+ {t('admin.add')}
						</Button>
					</div>
				</div>

				{loading ? (
					<Loader />
				) : displayed.length === 0 ? (
					<div className={s.empty}>{t('admin.noData')}</div>
				) : (
					<div className={s.grid}>
						{displayed.map(item => (
							<div key={item.id} className={s.card}>
								<div className={s.cardBody}>
									<div className={s.cardRow}>
										<span className={s.cardLabel}>{t('admin.fields.userId')}</span>
										<span>{item.user_id}</span>
									</div>
									<div className={s.cardRow}>
										<span className={s.cardLabel}>{t('admin.fields.subject')}</span>
										<span>{item.subject?.name || `#${item.subject_id}`}</span>
									</div>
									<div className={s.cardRow}>
										<span className={s.cardLabel}>{t('admin.fields.institutionType')}</span>
										<span>{item.institution_type?.name || `#${item.institution_type_id}`}</span>
									</div>
									<div className={s.cardRow}>
										<span className={s.cardLabel}>{t('admin.fields.endDate')}</span>
										<span>{new Date(item.end_date).toLocaleDateString()}</span>
									</div>
									<div className={s.cardRow}>
										<span className={s.cardLabel}>{t('admin.fields.status')}</span>
										<span className={item.is_active ? s.badgeGreen : s.badgeRed}>
											{item.is_active ? t('admin.active') : t('admin.inactive')}
										</span>
									</div>
								</div>
								<div className={s.cardActions}>
									<button
										className={`${s.actionBtn} ${s.actionBtnDanger}`}
										onClick={() => setDeleteItem(item)}>
										{t('admin.delete')}
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				<Modal
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					title={t('admin.addSubscription')}>
					<div className={s.formGroup}>
						<label>{t('admin.fields.userId')} *</label>
						<input
							type="number"
							value={form.user_id || ''}
							onChange={e => setForm({ ...form, user_id: Number(e.target.value) })}
							placeholder="ID"
						/>
					</div>
					<div className={s.formGroup}>
						<label>{t('admin.fields.subject')} *</label>
						<select
							value={form.subject_id}
							onChange={e => setForm({ ...form, subject_id: Number(e.target.value) })}>
							{subjects.map((subj: Subject) => (
								<option key={subj.id} value={subj.id}>{subj.name}</option>
							))}
						</select>
					</div>
					<div className={s.formGroup}>
						<label>{t('admin.fields.institutionType')} *</label>
						<select
							value={form.institution_type_id}
							onChange={e => setForm({ ...form, institution_type_id: Number(e.target.value) })}>
							{institutionTypes.map((it: InstitutionType) => (
								<option key={it.id} value={it.id}>{it.name}</option>
							))}
						</select>
					</div>
					<div className={s.formGroup}>
						<label>{t('admin.fields.endDate')} *</label>
						<input
							type="date"
							value={form.end_date}
							onChange={e => setForm({ ...form, end_date: e.target.value })}
						/>
					</div>
					<div className={s.formActions}>
						<Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
							{t('admin.cancel')}
						</Button>
						<Button size="sm" onClick={handleSubmit} loading={createMutation.isPending}>
							{t('admin.add')}
						</Button>
					</div>
				</Modal>

				<ConfirmModal
					open={!!deleteItem}
					onClose={() => setDeleteItem(null)}
					onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
					title={t('admin.confirmDelete')}
					message={t('admin.confirmDeleteSubMessage', { id: deleteItem?.id })}
					confirmText={t('admin.delete')}
					cancelText={t('admin.cancel')}
					loading={deleteMutation.isPending}
				/>
			</Container>
		</main>
	)
}

export default SubscriptionsPage
