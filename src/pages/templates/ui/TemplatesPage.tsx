import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Navigate } from 'react-router-dom'

import { useAuthStore } from '@/entities/user'
import {
	subjectApi,
	type Template,
	type TemplateCreate,
	type TemplateUpdate,
} from '@/entities/subject/api/subjectApi'

import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { SearchInput } from '@/shared/ui/search-input'
import { SectionTitle } from '@/shared/ui/section-title'
import { Modal } from '@/shared/ui/modal'
import { ConfirmModal } from '@/shared/ui/confirm-modal'
import { Loader } from '@/shared/ui/loader'
import s from './TemplatesPage.module.scss'

export const TemplatesPage = () => {
	const { t } = useTranslation()
	const { isAdmin } = useAuthStore()
	const queryClient = useQueryClient()

	if (!isAdmin()) return <Navigate to="/" replace />

	const [search, setSearch] = useState('')
	const [modalOpen, setModalOpen] = useState(false)
	const [editItem, setEditItem] = useState<Template | null>(null)
	const [deleteItem, setDeleteItem] = useState<Template | null>(null)
	const [form, setForm] = useState<TemplateCreate>({ name: '', code_name: '' })

	const { data: templates = [], isLoading } = useQuery({
		queryKey: ['templates'],
		queryFn: () => subjectApi.getTemplates({ limit: 1000 }),
	})

	const createMutation = useMutation({
		mutationFn: (data: TemplateCreate) => subjectApi.createTemplate(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['templates'] })
			toast.success(t('admin.created'))
			closeModal()
		},
		onError: () => toast.error(t('admin.createError')),
	})

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: TemplateUpdate }) =>
			subjectApi.updateTemplate(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['templates'] })
			toast.success(t('admin.updated'))
			closeModal()
		},
		onError: () => toast.error(t('admin.updateError')),
	})

	const deleteMutation = useMutation({
		mutationFn: (id: number) => subjectApi.deleteTemplate(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['templates'] })
			toast.success(t('admin.deleted'))
			setDeleteItem(null)
		},
		onError: () => toast.error(t('admin.deleteError')),
	})

	const filtered = useMemo(() => {
		if (!search) return templates
		const q = search.toLowerCase()
		return templates.filter(
			t => t.name.toLowerCase().includes(q) || t.code_name.toLowerCase().includes(q)
		)
	}, [templates, search])

	const openCreate = () => {
		setEditItem(null)
		setForm({ name: '', code_name: '' })
		setModalOpen(true)
	}

	const openEdit = (item: Template) => {
		setEditItem(item)
		setForm({ name: item.name, code_name: item.code_name })
		setModalOpen(true)
	}

	const closeModal = () => {
		setModalOpen(false)
		setEditItem(null)
	}

	const handleSubmit = () => {
		if (!form.name || !form.code_name) {
			toast.error(t('admin.fillRequired'))
			return
		}
		if (editItem) {
			updateMutation.mutate({ id: editItem.id, data: form })
		} else {
			createMutation.mutate(form)
		}
	}

	return (
		<main className={s.page}>
			<Container>
				<div className={s.header}>
					<SectionTitle title={t('admin.tabs.templates')} />
					<div className={s.toolbar}>
						<SearchInput
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder={t('admin.searchPlaceholder')}
							className={s.search}
						/>
						<Button size="sm" onClick={openCreate}>
							+ {t('admin.add')}
						</Button>
					</div>
				</div>

				{isLoading ? (
					<Loader />
				) : filtered.length === 0 ? (
					<div className={s.empty}>{t('admin.noData')}</div>
				) : (
					<div className={s.grid}>
						{filtered.map(item => (
							<div key={item.id} className={s.card}>
								<div className={s.cardBody}>
									<h3 className={s.cardTitle}>{item.name}</h3>
									<span className={s.cardCode}>{item.code_name}</span>
									<span className={s.cardDate}>
										{new Date(item.created_at).toLocaleDateString()}
									</span>
								</div>
								<div className={s.cardActions}>
									<button className={s.actionBtn} onClick={() => openEdit(item)}>
										{t('admin.edit')}
									</button>
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
					onClose={closeModal}
					title={editItem ? t('admin.editTemplate') : t('admin.addTemplate')}>
					<div className={s.formGroup}>
						<label>{t('admin.fields.name')} *</label>
						<input
							value={form.name}
							onChange={e => setForm({ ...form, name: e.target.value })}
						/>
					</div>
					<div className={s.formGroup}>
						<label>{t('admin.fields.codeName')} *</label>
						<input
							value={form.code_name}
							onChange={e => setForm({ ...form, code_name: e.target.value })}
						/>
					</div>
					<div className={s.formActions}>
						<Button variant="outline" size="sm" onClick={closeModal}>
							{t('admin.cancel')}
						</Button>
						<Button
							size="sm"
							onClick={handleSubmit}
							loading={createMutation.isPending || updateMutation.isPending}>
							{editItem ? t('admin.save') : t('admin.add')}
						</Button>
					</div>
				</Modal>

				<ConfirmModal
					open={!!deleteItem}
					onClose={() => setDeleteItem(null)}
					onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
					title={t('admin.confirmDelete')}
					message={t('admin.confirmDeleteMessage', { name: deleteItem?.name })}
					confirmText={t('admin.delete')}
					cancelText={t('admin.cancel')}
					loading={deleteMutation.isPending}
				/>
			</Container>
		</main>
	)
}

export default TemplatesPage
