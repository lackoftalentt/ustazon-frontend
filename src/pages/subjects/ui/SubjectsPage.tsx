import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { SearchInput } from '@/shared/ui/search-input'
import { SectionTitle } from '@/shared/ui/section-title'
import { Modal } from '@/shared/ui/modal'
import { ConfirmModal } from '@/shared/ui/confirm-modal'

import { SubjectCard } from '@/entities/subject'
import { useSubjects } from '@/entities/subject/model/useSubjects'
import { useAuthStore } from '@/entities/user'
import {
	subjectApi,
	type Subject,
	type SubjectCreate,
	type SubjectUpdate,
	type InstitutionType,
	type Window,
} from '@/entities/subject/api/subjectApi'

import { EmptyState } from '@/shared/ui/empty-state/ui/EmptyState'
import { ErrorState } from '@/shared/ui/error-state/ui/ErrorState'
import { Loader } from '@/shared/ui/loader'
import { useQuery } from '@tanstack/react-query'
import s from './SubjectsPage.module.scss'

const PAGE_SIZE = 9

const emptyForm: SubjectCreate = {
	name: '',
	code: '',
	image_url: '',
	hero_image_url: '',
	image_file: '',
	hero_image_file: '',
	institution_type_ids: [],
	window_ids: [],
}

export const SubjectsPage = () => {
	const { t } = useTranslation()
	const { isAdmin } = useAuthStore()
	const queryClient = useQueryClient()
	const admin = isAdmin()

	const [search, setSearch] = useState('')
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
	const [activeFilter, setActiveFilter] = useState<string | null>(null)
	const { data: subjects = [], isLoading, isError, refetch } = useSubjects()

	// Admin state
	const [modalOpen, setModalOpen] = useState(false)
	const [editItem, setEditItem] = useState<Subject | null>(null)
	const [deleteItem, setDeleteItem] = useState<Subject | null>(null)
	const [form, setForm] = useState<SubjectCreate>(emptyForm)

	const { data: institutionTypes = [] } = useQuery({
		queryKey: ['institution-types'],
		queryFn: () => subjectApi.getInstitutionTypes({ limit: 1000 }),
		enabled: admin,
	})

	const { data: windows = [] } = useQuery({
		queryKey: ['all-windows'],
		queryFn: () => subjectApi.getWindows({ limit: 1000 }),
		enabled: admin,
	})

	const createMutation = useMutation({
		mutationFn: (data: SubjectCreate) => subjectApi.createSubject(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subjects'] })
			toast.success(t('admin.created'))
			closeModal()
		},
		onError: () => toast.error(t('admin.createError')),
	})

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: number; data: SubjectUpdate }) =>
			subjectApi.updateSubject(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subjects'] })
			toast.success(t('admin.updated'))
			closeModal()
		},
		onError: () => toast.error(t('admin.updateError')),
	})

	const deleteMutation = useMutation({
		mutationFn: (id: number) => subjectApi.deleteSubject(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subjects'] })
			toast.success(t('admin.deleted'))
			setDeleteItem(null)
		},
		onError: () => toast.error(t('admin.deleteError')),
	})

	const filteredSubjects = useMemo(() => {
		let filtered = subjects.filter(subject =>
			subject.name.toLowerCase().includes(search.toLowerCase())
		)
		return filtered
	}, [subjects, search, activeFilter])

	const visibleSubjects = filteredSubjects.slice(0, visibleCount)
	const hasMore = visibleCount < filteredSubjects.length

	const handleLoadMore = () => setVisibleCount(prev => prev + PAGE_SIZE)
	const handleSearch = (value: string) => {
		setSearch(value)
		setVisibleCount(PAGE_SIZE)
	}
	const handleRetry = () => refetch()
	const handleClearSearch = () => {
		setSearch('')
		setActiveFilter(null)
		setVisibleCount(PAGE_SIZE)
	}

	// Admin handlers
	const openCreate = () => {
		setEditItem(null)
		setForm(emptyForm)
		setModalOpen(true)
	}

	const openEdit = (item: Subject) => {
		setEditItem(item)
		setForm({
			name: item.name,
			code: item.code,
			image_url: item.image_url || '',
			hero_image_url: item.hero_image_url || '',
			image_file: item.image_file || '',
			hero_image_file: item.hero_image_file || '',
			institution_type_ids: item.institution_types.map(it => it.id),
			window_ids: item.windows.map(w => w.id),
		})
		setModalOpen(true)
	}

	const closeModal = () => {
		setModalOpen(false)
		setEditItem(null)
	}

	const handleSubmit = () => {
		if (!form.name || !form.code) {
			toast.error(t('admin.fillRequired'))
			return
		}
		if (editItem) {
			updateMutation.mutate({ id: editItem.id, data: form })
		} else {
			createMutation.mutate(form)
		}
	}

	const toggleMultiSelect = (
		field: 'institution_type_ids' | 'window_ids',
		id: number
	) => {
		setForm(prev => {
			const arr = prev[field] || []
			return {
				...prev,
				[field]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id],
			}
		})
	}

	return (
		<main className={s.subjectMaterialPage}>
			<Container className={s.container}>
				<div className={s.header}>
					<SectionTitle
						className={s.title}
						title={t('subjects.catalogTitle')}
					/>

					<div className={s.searchContainer}>
						<SearchInput
							className={s.searchInput}
							placeholder={t('subjects.searchPlaceholder')}
							value={search}
							onChange={e => handleSearch(e.target.value)}
							onSubmit={() => {}}
						/>
					</div>

					{admin && (
						<Button size="sm" onClick={openCreate}>
							+ {t('admin.add')}
						</Button>
					)}
				</div>

				{isLoading && <Loader />}

				{isError && <ErrorState handleRetry={handleRetry} />}

				{!isLoading && !isError && (
					<>
						{visibleSubjects.length > 0 ? (
							<>
								<div className={s.cardsContainer}>
									{visibleSubjects.map(subject => (
										<SubjectCard
											key={subject.id}
											id={subject.id}
											title={subject.name}
											thumbnail={subject.image_file || subject.image_url || undefined}
											path={`/subject-windows/${subject.code || subject.id}`}
											onEdit={admin ? () => openEdit(subject) : undefined}
											onDelete={admin ? () => setDeleteItem(subject) : undefined}
										/>
									))}
								</div>

								{hasMore && (
									<div className={s.loadMoreContainer}>
										<Button
											className={s.loadMoreButton}
											onClick={handleLoadMore}
										>
											{t('subjects.showMore')}
										</Button>
									</div>
								)}
							</>
						) : (
							<EmptyState
								search={search}
								handleClearSearch={handleClearSearch}
							/>
						)}
					</>
				)}

				{/* Admin: Create/Edit Modal */}
				{admin && (
					<>
						<Modal
							open={modalOpen}
							onClose={closeModal}
							title={editItem ? t('admin.editSubject') : t('admin.addSubject')}>
							<div className={s.formGroup}>
								<label>{t('admin.fields.name')} *</label>
								<input
									value={form.name}
									onChange={e => setForm({ ...form, name: e.target.value })}
								/>
							</div>
							<div className={s.formGroup}>
								<label>{t('admin.fields.code')} *</label>
								<input
									value={form.code}
									onChange={e => setForm({ ...form, code: e.target.value })}
								/>
							</div>
							<div className={s.formGroup}>
								<label>{t('admin.fields.imageUrl')}</label>
								<input
									value={form.image_url || ''}
									onChange={e => setForm({ ...form, image_url: e.target.value })}
								/>
							</div>
							<div className={s.formGroup}>
								<label>{t('admin.fields.heroImageUrl')}</label>
								<input
									value={form.hero_image_url || ''}
									onChange={e => setForm({ ...form, hero_image_url: e.target.value })}
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
								<label>{t('admin.fields.heroImageFile')}</label>
								<input
									value={form.hero_image_file || ''}
									onChange={e => setForm({ ...form, hero_image_file: e.target.value })}
								/>
							</div>
							<div className={s.formGroup}>
								<label>{t('admin.fields.institutionTypes')}</label>
								<div className={s.multiSelect}>
									{institutionTypes.map((it: InstitutionType) => (
										<button
											key={it.id}
											type="button"
											className={`${s.chip} ${
												form.institution_type_ids?.includes(it.id) ? s.chipSelected : ''
											}`}
											onClick={() => toggleMultiSelect('institution_type_ids', it.id)}>
											{it.name}
										</button>
									))}
								</div>
							</div>
							<div className={s.formGroup}>
								<label>{t('admin.fields.windows')}</label>
								<div className={s.multiSelect}>
									{windows.map((w: Window) => (
										<button
											key={w.id}
											type="button"
											className={`${s.chip} ${
												form.window_ids?.includes(w.id) ? s.chipSelected : ''
											}`}
											onClick={() => toggleMultiSelect('window_ids', w.id)}>
											{w.name}
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

export default SubjectsPage
