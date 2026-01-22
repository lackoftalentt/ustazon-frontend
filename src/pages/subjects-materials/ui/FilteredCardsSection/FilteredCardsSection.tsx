import type { CardListItem } from '@/entities/card/api/cardApi'
import { useDeleteCard, useToggleFavorite } from '@/entities/card/model/useCards'
import { useFavoritesStore } from '@/entities/card/model/useFavoritesStore'
import { MaterialCard } from '@/entities/material'
import { useAuthStore } from '@/entities/user/model/store/useAuthStore'
import { Button } from '@/shared/ui/button'
import { ConfirmModal } from '@/shared/ui/confirm-modal'
import { useState } from 'react'
import toast from 'react-hot-toast'
import s from '../SubjectsMaterialsPage.module.scss'

interface FilteredCardsSectionProps {
	cards: CardListItem[]
	subjectCode: string
	hasNextPage: boolean
	isFetchingNextPage: boolean
	onLoadMore: () => void
}

export const FilteredCardsSection = ({
	cards,
	subjectCode,
	hasNextPage,
	isFetchingNextPage,
	onLoadMore
}: FilteredCardsSectionProps) => {
	const { mutate: toggleFavoriteApi } = useToggleFavorite()
	const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard()
	const { isFavorite, toggleFavorite: toggleFavoriteLocal } = useFavoritesStore()
	const user = useAuthStore(state => state.user)

	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [cardToDelete, setCardToDelete] = useState<number | null>(null)

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

	if (cards.length === 0) return null

	return (
		<div className={s.windowSection}>
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
						thumbnail={card.img1_url}
						path={`/subjects-materials/${subjectCode}/detail/${card.id}`}
						isFavorite={isFavorite(card.id)}
						showDelete={user?.id === card.author?.id}
						onFavoriteToggle={handleFavoriteToggle}
						onDelete={handleDeleteClick}
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
