import { AlertTriangle, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { SubjectCard } from '@/entities/subject'
import {
	useSubjectByCode,
	useWindows
} from '@/entities/subject/model/useSubjects'
import { useAuthStore } from '@/entities/user'
import {
	subjectApi,
	type Window,
	type WindowCreate,
	type WindowUpdate,
	type Template,
	type Subject,
} from '@/entities/subject/api/subjectApi'

import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { SearchInput } from '@/shared/ui/search-input'
import { SectionTitle } from '@/shared/ui/section-title'
import { Modal } from '@/shared/ui/modal'
import { ConfirmModal } from '@/shared/ui/confirm-modal'

import { KmzhBanner } from '@/widgets/kmzh-banner'
import { TestBanner } from '@/widgets/test-banner'

import { LoaderPage } from '@/pages/loader-page'
import { Loader } from '@/shared/ui/loader'
import { useNavigate, useParams } from 'react-router'
import s from './SubjectWindowsPage.module.scss'

const PAGE_SIZE = 12

const emptyForm: WindowCreate = {
	name: '',
	template_id: null,
	link: '',
	nsub: false,
	image_url: '',
	image_file: '',
	subject_ids: [],
}

export const SubjectWindowsPage = () => {
	const { subjectCode } = useParams<{ subjectCode: string }>()
	const navigate = useNavigate()
	const { t } = useTranslation()
	const { isAdmin } = useAuthStore()
	const queryClient = useQueryClient()
	const admin = isAdmin()

	const { data: subject, isLoading: isLoadingSubject } = useSubjectByCode(
		subjectCode || '',
		{ enabled: !!subjectCode }
	)

	const { data: windows = [], isLoading, isError, refetch } = useWindows()

	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

	// Admin state
	const [modalOpen, setModalOpen] = useState(false)
	const [editItem, setEditItem] = useState<Window | null>(null)
	const [deleteItem, setDeleteItem] = useState<Window | null>(null)
	const [form, setForm] = useState<WindowCreate>(emptyForm)

	const { data: templates = [] } = useQuery({
		queryKey: ['admin-templates'],
		queryFn: () => subjectApi.getTemplates({ limit: 1000 }),
		enabled: admin,
	})

	const { data: allSubjects = [] } = useQuery({
		queryKey: ['admin-subjects'],
		queryFn: () => subjectApi.getSubjects({ limit: 1000 }),
		enabled: admin,
	})

	const createMutation = useMutation({
		mutationFn: (data: WindowCreate) => subjectApi.createWindow(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['windows'] })
			toast.success(t('admin.created'))
			closeModal()
		},
		onError: () => toast.error(t('admin.createError')),
	})

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: WindowUpdate }) =>
			subjectApi.updateWindow(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['windows'] })
			toast.success(t('admin.updated'))
			closeModal()
		},
		onError: () => toast.error(t('admin.updateError')),
	})

	const deleteMutation = useMutation({
		mutationFn: (id: number) => subjectApi.deleteWindow(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['windows'] })
			toast.success(t('admin.deleted'))
			setDeleteItem(null)
		},
		onError: () => toast.error(t('admin.deleteError')),
	})

	const gridWindows = useMemo(() => {
		return windows.filter(w => w.id !== 18 && w.id !== 19)
	}, [windows])

	const visibleWindows = useMemo(() => {
		return gridWindows.slice(0, visibleCount)
	}, [gridWindows, visibleCount])

	const hasMore = visibleCount < gridWindows.length

	const handleLoadMore = () => setVisibleCount(prev => prev + PAGE_SIZE)
	const handleRetry = () => refetch()

	// Admin handlers
	const openCreate = () => {
		setEditItem(null)
		setForm(emptyForm)
		setModalOpen(true)
	}

	const openEdit = (item: Window) => {
		setEditItem(item)
		setForm({
			name: item.name,
			template_id: item.template_id,
			link: item.link || '',
			nsub: item.nsub,
			image_url: item.image_url || '',
			image_file: item.image_file || '',
			subject_ids: [],
		})
		setModalOpen(true)
	}

	const closeModal = () => {
		setModalOpen(false)
		setEditItem(null)
	}

	const handleSubmit = () => {
		if (!form.name) {
			toast.error(t('admin.fillRequired'))
			return
		}
		const data = { ...form, template_id: form.template_id || null }
		if (editItem) {
			updateMutation.mutate({ id: editItem.id, data })
		} else {
			createMutation.mutate(data)
		}
	}

	const toggleSubject = (id: number) => {
		setForm(prev => {
			const arr = prev.subject_ids || []
			return {
				...prev,
				subject_ids: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id],
			}
		})
	}

	if (isLoadingSubject) {
		return <LoaderPage />
	}

	if (!subject) {
		return (
			<div className={s.errorState}>
				<div className={s.errorIcon}>
					<AlertTriangle />
				</div>
				<h3 className={s.errorTitle}>Жүктеу сәтсіз аяқталды</h3>
				<p className={s.errorDescription}>
					Терезелерді жүктеу кезінде қате пайда болды. Қайта байқап көріңіз.
				</p>
				<button
					className={s.retryButton}
					onClick={handleRetry}
				>
					Қайта жүктеу
				</button>
			</div>
		)
	}

	return (
		<main className={s.subjectWindowsPage}>
			<Container className={s.container}>
				<SectionTitle
					className={s.title}
					title={subject.name}
				/>

				<div className={s.searchContainer}>
					<SearchInput
						className={s.searchInput}
						placeholder="Материал іздеу..."
						onFocus={() => navigate(`/subjects-materials/${subjectCode}`)}
						readOnly
					/>
				</div>

				{admin && (
					<div style={{ marginBottom: 20 }}>
						<Button size="sm" onClick={openCreate}>
							+ {t('admin.add')}
						</Button>
					</div>
				)}

				{subjectCode && (
					<div className={s.widgetsSection}>
						<KmzhBanner subjectCode={subjectCode} />
						<TestBanner subjectCode={subjectCode} />
					</div>
				)}

				{isLoading && <Loader />}

				{isError && (
					<div className={s.errorState}>
						<div className={s.errorIcon}>
							<AlertTriangle />
						</div>
						<h3 className={s.errorTitle}>Жүктеу сәтсіз аяқталды</h3>
						<p className={s.errorDescription}>
							Терезелерді жүктеу кезінде қате пайда болды. Қайта байқап көріңіз.
						</p>
						<button
							className={s.retryButton}
							onClick={handleRetry}
						>
							Қайта жүктеу
						</button>
					</div>
				)}

				{!isLoading && !isError && (
					<>
						{visibleWindows.length > 0 ? (
							<>
								<div className={s.windowsList}>
									{visibleWindows.map(w => {
										const path = `/subjects-materials/${subjectCode}?window=${w.id}`

										return (
											<SubjectCard
												key={w.id}
												id={w.id}
												title={w.name}
												thumbnail={w.image_file || w.image_url}
												path={path}
												onEdit={admin ? () => openEdit(w) : undefined}
												onDelete={admin ? () => setDeleteItem(w) : undefined}
											/>
										)
									})}
								</div>

								{hasMore && (
									<div className={s.loadMoreContainer}>
										<Button
											className={s.loadMoreButton}
											onClick={handleLoadMore}
										>
											Тағы көрсету
										</Button>
									</div>
								)}
							</>
						) : (
							<div className={s.emptyState}>
								<div className={s.emptyIcon}>
									<Search />
								</div>
								<h3 className={s.emptyTitle}>Терезелер табылмады</h3>
								<p className={s.emptyDescription}>
									Пока терезелер жоқ
								</p>
							</div>
						)}
					</>
				)}

				{/* Admin: Create/Edit Modal */}
				{admin && (
					<>
						<Modal
							open={modalOpen}
							onClose={closeModal}
							title={editItem ? t('admin.editWindow') : t('admin.addWindow')}>
							<div className={s.formGroup}>
								<label>{t('admin.fields.name')} *</label>
								<input
									value={form.name}
									onChange={e => setForm({ ...form, name: e.target.value })}
								/>
							</div>
							<div className={s.formGroup}>
								<label>{t('admin.fields.template')}</label>
								<select
									value={form.template_id || ''}
									onChange={e =>
										setForm({
											...form,
											template_id: e.target.value ? Number(e.target.value) : null,
										})
									}>
									<option value="">{t('admin.selectNone')}</option>
									{templates.map((tmpl: Template) => (
										<option key={tmpl.id} value={tmpl.id}>
											{tmpl.name}
										</option>
									))}
								</select>
							</div>
							<div className={s.formGroup}>
								<label>{t('admin.fields.link')}</label>
								<input
									value={form.link || ''}
									onChange={e => setForm({ ...form, link: e.target.value })}
								/>
							</div>
							<div className={s.checkboxGroup}>
								<input
									type="checkbox"
									id="nsub-win"
									checked={form.nsub || false}
									onChange={e => setForm({ ...form, nsub: e.target.checked })}
								/>
								<label htmlFor="nsub-win">{t('admin.fields.requiresSub')}</label>
							</div>
							<div className={s.formGroup}>
								<label>{t('admin.fields.imageUrl')}</label>
								<input
									value={form.image_url || ''}
									onChange={e => setForm({ ...form, image_url: e.target.value })}
								/>
							</div>
							<div className={s.formGroup}>
								<label>{t('admin.fields.imageFile')}</label>
								<input
									value={form.image_file || ''}
									onChange={e => setForm({ ...form, image_file: e.target.value })}
								/>
							</div>
							<div className={s.formGroup}>
								<label>{t('admin.fields.subjects')}</label>
								<div className={s.multiSelect}>
									{allSubjects.map((subj: Subject) => (
										<button
											key={subj.id}
											type="button"
											className={`${s.chip} ${
												form.subject_ids?.includes(subj.id) ? s.chipSelected : ''
											}`}
											onClick={() => toggleSubject(subj.id)}>
											{subj.name}
										</button>
									))}
								</div>
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
					</>
				)}
			</Container>
		</main>
	)
}

export default SubjectWindowsPage
