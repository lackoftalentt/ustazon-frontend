import type { CardListItem } from '@/entities/card/api/cardApi'
import {
	useDeleteCard,
	useToggleFavorite
} from '@/entities/card/model/useCards'
import { useFavoritesStore } from '@/entities/card/model/useFavoritesStore'
import { useAuthStore } from '@/entities/user/model/store/useAuthStore'
import { MaterialCard } from '@/entities/material'
import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react'
import { ConfirmModal } from '@/shared/ui/confirm-modal'
import { SectionTitle } from '@/shared/ui/section-title'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import s from '../SubjectsMaterialsPage.module.scss'

interface MaterialsCategorySectionProps {
	name: string
	cards: CardListItem[]
	subjectCode: string
	windowId: number
}

const windowIdToBadge: Record<number, string> = {
	1: 'Жасанды интеллект',
	2: 'Онлайн тақта',
	3: 'Квиз ойын',
	4: 'Дидактикалық ойын',
	6: 'Ойын платформа',
	7: 'Презентация',
	8: 'Презентация',
	9: 'Презентация',
	10: 'Презентация',
	11: 'Жұмыс парағы',
	12: 'Көрнекілік',
	13: 'Олимпиада',
	14: 'Мат. сауаттылық',
	15: 'Электронды оқулық',
	16: 'Desmos ойын',
	17: 'Анимация',
	18: 'Тест',
	19: 'ҚМЖ',
	20: 'Электронды журнал',
	21: 'Progress Arena',
	22: 'Python',
	23: 'Тақырыптық тапсырма',
	24: 'Олимпиада есеп',
	25: 'AI chat',
	26: 'AI animation'
}

export const MaterialsCategorySection = ({
	name,
	cards,
	subjectCode,
	windowId
}: MaterialsCategorySectionProps) => {
	const { mutate: toggleFavoriteApi } = useToggleFavorite()
	const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard()
	const { isFavorite, toggleFavorite: toggleFavoriteLocal } =
		useFavoritesStore()
	const user = useAuthStore(state => state.user)
	const displayCards = cards.slice(0, 4)
	const hasMore = cards.length > 3

	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [cardToDelete, setCardToDelete] = useState<number | null>(null)

	const badgeName = windowIdToBadge[windowId] || 'Карточка'

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

	return (
		<div className={s.windowSection}>
			<SectionTitle
				className={s.rowTitle}
				title={name}
			/>
			<div className={s.container}>
				{displayCards.map(card => (
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
						templateName={badgeName}
						isFavorite={isFavorite(card.id)}
						showDelete={user?.id === card.author?.id}
						onFavoriteToggle={handleFavoriteToggle}
						onDelete={handleDeleteClick}
					/>
				))}
			</div>
			{hasMore && (
				<div className={s.showMoreWrapper}>
					<Link
						to={`/subjects-materials/${subjectCode}?window=${windowId}`}
						className={s.showMoreLink}
					>
						Көбірек көру
						<ArrowIcon className={s.arrowIcon} />
					</Link>
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
