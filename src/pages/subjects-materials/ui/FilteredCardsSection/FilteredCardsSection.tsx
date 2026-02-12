import type { CardListItem } from '@/entities/card/api/cardApi'
import { useDeleteCard, useToggleFavorite } from '@/entities/card/model/useCards'
import { useFavoritesStore } from '@/entities/card/model/useFavoritesStore'
import { MaterialCard } from '@/entities/material'
import { useAuthStore } from '@/entities/user/model/store/useAuthStore'
import { Button } from '@/shared/ui/button'
import { ConfirmModal } from '@/shared/ui/confirm-modal'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useDropUpload } from '../../model/useDropUpload'
import { DropOverlay } from '../DropOverlay'
import s from '../SubjectsMaterialsPage.module.scss'

interface FilteredCardsSectionProps {
	cards: CardListItem[]
	subjectCode: string
	hasNextPage: boolean
	isFetchingNextPage: boolean
	isLocked?: boolean
	onLoadMore: () => void
	showAdminEdit?: boolean
	onAdminEdit?: (id: number) => void
	windowId?: number
	subjectId?: number
	isAdmin?: boolean
}

export const FilteredCardsSection = ({
	cards,
	subjectCode,
	hasNextPage,
	isFetchingNextPage,
	isLocked,
	onLoadMore,
	showAdminEdit,
	onAdminEdit,
	windowId,
	subjectId,
	isAdmin
}: FilteredCardsSectionProps) => {
	const { mutate: toggleFavoriteApi } = useToggleFavorite()
	const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard()
	const { isFavorite, toggleFavorite: toggleFavoriteLocal } = useFavoritesStore()
	const user = useAuthStore(state => state.user)

	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [cardToDelete, setCardToDelete] = useState<number | null>(null)

	const { isDragOver, isUploading, dragProps } = useDropUpload({
		windowId: windowId ?? 0,
		subjectId,
		enabled: !!isAdmin && !!windowId
	})

	const handleFavoriteToggle = (id: number) => {
		const isNowFavorite = toggleFavoriteLocal(id)

		toggleFavoriteApi(id, {
			onSuccess: () => {
				toast.success(
					isNowFavorite ? 'Таңдаулыға қосылды' : 'Таңдаулыдан алынды'
				)
			},
			onError: () => {
				toggleFavoriteLocal(id)
				toast.error('Қате орын алды')
			}
		})
	}

	const handleDeleteClick = (id: number) => {
		setCardToDelete(id)
		setDeleteModalOpen(true)
	}

	const handleDeleteConfirm = () => {
		if (cardToDelete === null) return

		deleteCard(cardToDelete, {
			onSuccess: () => {
				toast.success('Карточка сәтті жойылды')
				setDeleteModalOpen(false)
				setCardToDelete(null)
			},
			onError: () => {
				toast.error('Карточканы жою кезінде қате орын алды')
			}
		})
	}

	const handleDeleteCancel = () => {
		setDeleteModalOpen(false)
		setCardToDelete(null)
	}

	if (cards.length === 0 && !isAdmin) return null

	return (
		<div
			className={`${s.windowSection}${isDragOver ? ` ${s.dropActive}` : ''}`}
			{...dragProps}
		>
			<div className={s.container}>
				{cards.map(card => (
					<MaterialCard
						key={card.id}
						id={card.id}
						title={card.name}
						description={
							card.description ||
							`${card.topic?.topic || 'Материал'}${card.grade ? ` • ${card.grade}-сынып` : ''}`
						}
						thumbnails={[card.img1_url, card.img2_url, card.img3_url, card.img4_url, card.img5_url]}
						path={`/subjects-materials/${subjectCode}/detail/${card.id}`}
						isFavorite={isFavorite(card.id)}
						isLocked={isLocked}
						showDelete={!isLocked && (user?.id === card.author?.id || !!showAdminEdit)}
						showEdit={!!showAdminEdit}
						onFavoriteToggle={handleFavoriteToggle}
						onDelete={handleDeleteClick}
						onEdit={onAdminEdit}
					/>
				))}
			</div>
			{hasNextPage && (
				<div className={s.loadMoreContainer}>
					<Button
						className={s.loadMoreButton}
						onClick={onLoadMore}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage ? 'Жүктелуде...' : 'Көбірек көрсету'}
					</Button>
				</div>
			)}

			<DropOverlay isDragOver={isDragOver} isUploading={isUploading} />

			<ConfirmModal
				open={deleteModalOpen}
				onClose={handleDeleteCancel}
				onConfirm={handleDeleteConfirm}
				title="Карточканы жою"
				message="Карточканы жоюға сенімдісіз бе? Бұл әрекетті қайтару мүмкін емес."
				confirmText="Жою"
				cancelText="Бас тарту"
				variant="danger"
				loading={isDeleting}
			/>
		</div>
	)
}
