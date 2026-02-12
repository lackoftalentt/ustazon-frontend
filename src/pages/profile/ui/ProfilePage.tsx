import {
	useMyFavorites,
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
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import s from './ProfilePage.module.scss'

const ITEMS_PER_PAGE = 8

export const ProfilePage = () => {
	const { t } = useTranslation()

	const getWindowBadge = (id: number): string => {
		const map: Record<number, string> = {
			1: t('windowBadge.ai'),
			2: t('windowBadge.onlineBoard'),
			3: t('windowBadge.quizGame'),
			4: t('windowBadge.didacticGame'),
			6: t('windowBadge.gamePlatform'),
			7: t('windowBadge.presentation'),
			8: t('windowBadge.presentation'),
			9: t('windowBadge.presentation'),
			10: t('windowBadge.presentation'),
			11: t('windowBadge.worksheet'),
			12: t('windowBadge.visual'),
			13: t('windowBadge.olympiad'),
			14: t('windowBadge.mathLiteracy'),
			15: t('windowBadge.ebook'),
			16: t('windowBadge.desmosGame'),
			17: t('windowBadge.animation'),
			18: t('windowBadge.test'),
			19: t('windowBadge.kmzh'),
			20: t('windowBadge.eJournal'),
			21: t('windowBadge.progressArena'),
			22: t('windowBadge.python'),
			23: t('windowBadge.thematicTask'),
			24: t('windowBadge.olympiadProblem'),
			25: t('windowBadge.aiChat'),
			26: t('windowBadge.aiAnimation')
		}
		return map[id] || t('profile.card')
	}
	const { user } = useAuthStore()
	const [searchQuery, setSearchQuery] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [cardToDelete, setCardToDelete] = useState<number | null>(null)

	const {
		isFavorite,
		toggleFavorite: toggleFavoriteLocal
	} = useFavoritesStore()
	const { mutate: toggleFavoriteApi } = useToggleFavorite()
	const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard()

	// Fetch favorites from backend API instead of localStorage
	const { data: favoriteCards = [], isLoading } = useMyFavorites({ limit: 100 })

	// Sync localStorage with backend data on load
	useEffect(() => {
		if (favoriteCards.length > 0) {
			const backendIds = new Set(favoriteCards.map(c => c.id))
			const store = useFavoritesStore.getState()
			// Sync: set localStorage to match backend
			backendIds.forEach(id => {
				if (!store.isFavorite(id)) store.toggleFavorite(id)
			})
			store.favoriteIds.forEach(id => {
				if (!backendIds.has(id)) store.toggleFavorite(id)
			})
		}
	}, [favoriteCards])

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
					isNowFavorite ? t('profile.addedToFavorites') : t('profile.removedFromFavorites')
				)
			},
			onError: () => {
				toggleFavoriteLocal(id)
				toast.error(t('profile.errorOccurred'))
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
				toast.success(t('profile.cardDeleted'))
				setDeleteModalOpen(false)
				setCardToDelete(null)
				if (isFavorite(cardToDelete)) {
					toggleFavoriteLocal(cardToDelete)
				}
			},
			onError: () => {
				toast.error(t('profile.cardDeleteError'))
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
							<h1 className={s.userName}>{user?.name || t('profile.user')}</h1>
							<p className={s.userPhone}>{user?.phoneNumber || ''}</p>
						</div>
					</div>
					<Link to="/profile-settings">
						<Button
							variant="outline"
							className={s.settingsButton}
						>
							<Settings size={18} />
							{t('profile.settings')}
						</Button>
					</Link>
				</div>

				<div className={s.stats}>
					<div className={s.statCard}>
						<div className={s.statIcon}>
							<BookMarked size={24} />
						</div>
						<div className={s.statInfo}>
							<span className={s.statValue}>{favoriteCards.length}</span>
							<span className={s.statLabel}>{t('profile.savedMaterials')}</span>
						</div>
					</div>
					<div className={s.statCard}>
						<div className={s.statIcon}>
							<CheckCircle size={24} />
						</div>
						<div className={s.statInfo}>
							<span className={s.statValue}>0</span>
							<span className={s.statLabel}>{t('profile.completedTests')}</span>
						</div>
					</div>
					<div className={s.statCard}>
						<div className={s.statIcon}>
							<Eye size={24} />
						</div>
						<div className={s.statInfo}>
							<span className={s.statValue}>0</span>
							<span className={s.statLabel}>{t('profile.viewedCards')}</span>
						</div>
					</div>
				</div>

				<section className={s.materialsSection}>
					<h2 className={s.sectionTitle}>{t('profile.favoriteMaterials')}</h2>

					<div className={s.controls}>
						<SearchInput
							placeholder={t('profile.searchMaterials')}
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
											`${card.topic?.topic || t('profile.material')}${card.grade ? ` • ${card.grade}-сынып` : ''}`
										}
										thumbnail={card.img1_url}
										path={`/subjects-materials/${card.subject_card || 'all'}/detail/${card.id}`}
										templateName={
											card.window_id
												? getWindowBadge(card.window_id)
												: t('profile.card')
										}
										isFavorite={true}
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
							<p>{t('profile.noFavorites')}</p>
						</div>
					)}
				</section>
			</Container>

			<ConfirmModal
				open={deleteModalOpen}
				onClose={handleDeleteCancel}
				onConfirm={handleDeleteConfirm}
				title={t('profile.deleteCard')}
				message={t('profile.deleteCardConfirm')}
				confirmText={t('profile.delete')}
				cancelText={t('profile.cancel')}
				variant="danger"
				loading={isDeleting}
			/>
		</main>
	)
}

export default ProfilePage
