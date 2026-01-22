import {
	useCards,
	useDeleteCard,
	useToggleFavorite
} from '@/entities/card/model/useCards'
import { useFavoritesStore } from '@/entities/card/model/useFavoritesStore'
import { MaterialCard } from '@/entities/material'
import { useAuthStore } from '@/entities/user'
import { Button } from '@/shared/ui/button'
import { ConfirmModal } from '@/shared/ui/confirm-modal'
import { Container } from '@/shared/ui/container'
import { Loader } from '@/shared/ui/loader'
import { SearchInput } from '@/shared/ui/search-input'
import {
	BookMarked,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Eye,
	Settings
} from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import s from './ProfilePage.module.scss'

const ITEMS_PER_PAGE = 8

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

export const ProfilePage = () => {
	const { user } = useAuthStore()
	const [searchQuery, setSearchQuery] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [cardToDelete, setCardToDelete] = useState<number | null>(null)

	const {
		favoriteIds,
		isFavorite,
		toggleFavorite: toggleFavoriteLocal
	} = useFavoritesStore()
	const { mutate: toggleFavoriteApi } = useToggleFavorite()
	const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard()

	const favoriteIdsArray = useMemo(() => Array.from(favoriteIds), [favoriteIds])

	const { data: allCards = [], isLoading } = useCards(
		favoriteIdsArray.length > 0 ? { limit: 1000 } : undefined
	)

	const favoriteCards = useMemo(() => {
		return allCards.filter(card => favoriteIds.has(card.id))
	}, [allCards, favoriteIds])

	const filteredCards = useMemo(() => {
		if (!searchQuery.trim()) return favoriteCards

		const query = searchQuery.toLowerCase()
		return favoriteCards.filter(
			card =>
				card.name.toLowerCase().includes(query) ||
				card.description?.toLowerCase().includes(query) ||
				card.topic?.topic?.toLowerCase().includes(query)
		)
	}, [favoriteCards, searchQuery])

	const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE)
	const paginatedCards = filteredCards.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	)

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
		setCurrentPage(1)
	}

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
				if (isFavorite(cardToDelete)) {
					toggleFavoriteLocal(cardToDelete)
				}
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
		<main className={s.profilePage}>
			<Container>
				<div className={s.header}>
					<div className={s.userInfo}>
						<div className={s.avatar}>
							{user?.name?.charAt(0).toUpperCase() || 'U'}
						</div>
						<div className={s.userDetails}>
							<h1 className={s.userName}>{user?.name || 'Пайдаланушы'}</h1>
							<p className={s.userPhone}>{user?.phoneNumber || ''}</p>
						</div>
					</div>
					<Link to="/profile-settings">
						<Button
							variant="outline"
							className={s.settingsButton}
						>
							<Settings size={18} />
							Баптаулар
						</Button>
					</Link>
				</div>

				<div className={s.stats}>
					<div className={s.statCard}>
						<div className={s.statIcon}>
							<BookMarked size={24} />
						</div>
						<div className={s.statInfo}>
							<span className={s.statValue}>{favoriteIdsArray.length}</span>
							<span className={s.statLabel}>Сақталған материалдар</span>
						</div>
					</div>
					<div className={s.statCard}>
						<div className={s.statIcon}>
							<CheckCircle size={24} />
						</div>
						<div className={s.statInfo}>
							<span className={s.statValue}>0</span>
							<span className={s.statLabel}>Өтілген тесттер</span>
						</div>
					</div>
					<div className={s.statCard}>
						<div className={s.statIcon}>
							<Eye size={24} />
						</div>
						<div className={s.statInfo}>
							<span className={s.statValue}>0</span>
							<span className={s.statLabel}>Қаралған карточкалар</span>
						</div>
					</div>
				</div>

				<section className={s.materialsSection}>
					<h2 className={s.sectionTitle}>Таңдаулы материалдар</h2>

					<div className={s.controls}>
						<SearchInput
							placeholder="Материалдарды іздеу..."
							value={searchQuery}
							onChange={handleSearch}
							className={s.searchInput}
						/>
					</div>

					{isLoading ? (
						<Loader />
					) : paginatedCards.length > 0 ? (
						<>
							<div className={s.materialsGrid}>
								{paginatedCards.map(card => (
									<MaterialCard
										key={card.id}
										id={card.id}
										title={card.name}
										description={
											card.description ||
											`${card.topic?.topic || 'Материал'}${card.grade ? ` • ${card.grade}-сынып` : ''}`
										}
										thumbnail={card.img1_url}
										path={`/subjects-materials/${card.subject_card || 'all'}/detail/${card.id}`}
										templateName={
											card.window_id
												? windowIdToBadge[card.window_id] || 'Карточка'
												: 'Карточка'
										}
										isFavorite={isFavorite(card.id)}
										showDelete={user?.id === card.author?.id}
										onFavoriteToggle={handleFavoriteToggle}
										onDelete={handleDeleteClick}
									/>
								))}
							</div>

							{totalPages > 1 && (
								<div className={s.pagination}>
									<button
										className={s.paginationButton}
										onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
										disabled={currentPage === 1}
									>
										<ChevronLeft size={18} />
									</button>

									<div className={s.paginationNumbers}>
										{Array.from({ length: totalPages }, (_, i) => i + 1).map(
											page => (
												<button
													key={page}
													className={`${s.pageNumber} ${
														currentPage === page ? s.active : ''
													}`}
													onClick={() => setCurrentPage(page)}
												>
													{page}
												</button>
											)
										)}
									</div>

									<button
										className={s.paginationButton}
										onClick={() =>
											setCurrentPage(p => Math.min(totalPages, p + 1))
										}
										disabled={currentPage === totalPages}
									>
										<ChevronRight size={18} />
									</button>
								</div>
							)}
						</>
					) : (
						<div className={s.emptyState}>
							<BookMarked
								size={48}
								strokeWidth={1.5}
							/>
							<p>
								{favoriteIdsArray.length === 0
									? 'Таңдаулы материалдар жоқ'
									: 'Материалдар табылмады'}
							</p>
						</div>
					)}
				</section>
			</Container>

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
		</main>
	)
}

export default ProfilePage
