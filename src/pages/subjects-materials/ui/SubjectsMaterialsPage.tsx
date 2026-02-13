import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react'
import AnimationIcon from '@/shared/assets/icons/section-animation.svg?react'
import GameIcon from '@/shared/assets/icons/section-game.svg?react'
import KmzhIcon from '@/shared/assets/icons/section-kmzh.svg?react'
import PresentationIcon from '@/shared/assets/icons/section-presentation.svg?react'
import TestIcon from '@/shared/assets/icons/section-test.svg?react'
import WorksheetIcon from '@/shared/assets/icons/section-worksheet.svg?react'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { Loader } from '@/shared/ui/loader'
import { SearchInput } from '@/shared/ui/search-input'
import { SectionTitle } from '@/shared/ui/section-title'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useSubjectMaterialsPage } from '../model/useSubjectMaterialsPage'
import { useAuthStore } from '@/entities/user/model/store/useAuthStore'
import { FilteredCardsSection } from './FilteredCardsSection'
import { GradeQuarterFilter } from './GradeQuarterFilter/GradeQuarterFilter'
import { KmzhSection } from './KmzhSection'
import { MaterialsCategorySection } from './MaterialsCategorySection'
import type { SectionNavItem } from './SectionNav/SectionNav'
import { SectionNav } from './SectionNav/SectionNav'
import s from './SubjectsMaterialsPage.module.scss'
import { TestsSection } from './TestsSection'
import { WindowFilterBadge } from './WindowFilterBadge'
import { CardFormModal } from './CardFormModal'
import { PaywallModal } from '@/shared/ui/paywall-modal'

export const SubjectsMaterialsPage = () => {
	const { t } = useTranslation()
	const { isAdmin } = useAuthStore()
	const admin = isAdmin()

	const {
		subjectCode,
		subject,
		grade,
		quarter,
		windowId,
		windowData,
		searchInput,
		categories,
		filteredWindowCards,
		kmzhData,
		testsData,
		isLocked,
		isLoadingSubject,
		isLoadingCards,
		isLoadingKmzh,
		isLoadingTests,
		hasError,
		hasNextPage,
		isFetchingNextPage,
		totalCards,
		handleRetry,
		handleClearFilters,
		handleGradeChange,
		handleQuarterChange,
		handleClearWindow,
		handleLoadMore,
		setSearchInput
	} = useSubjectMaterialsPage()

	// Paywall modal state
	const [paywallOpen, setPaywallOpen] = useState(false)
	const handleLockedClick = () => setPaywallOpen(true)

	// Admin card form modal state
	const [cardModalOpen, setCardModalOpen] = useState(false)
	const [editCardId, setEditCardId] = useState<number | null>(null)

	const handleAdminEdit = (id: number) => {
		setEditCardId(id)
		setCardModalOpen(true)
	}

	const handleAdminCreate = () => {
		setEditCardId(null)
		setCardModalOpen(true)
	}

	const handleCardModalClose = () => {
		setCardModalOpen(false)
		setEditCardId(null)
	}

	// Build section nav items based on what data is available or loading
	const sectionNavItems = useMemo((): SectionNavItem[] => {
		if (windowId) return []
		const items: SectionNavItem[] = []

		if (isLoadingKmzh || (kmzhData && kmzhData.length > 0)) {
			items.push({ id: 'section-kmzh', label: t('materials.kmzh'), icon: KmzhIcon })
		}
		if (isLoadingCards || categories.some(c => c.windowId === 7)) {
			items.push({ id: 'section-presentations', label: t('materials.presentations'), icon: PresentationIcon })
		}
		if (isLoadingCards || categories.some(c => c.windowId === 11)) {
			items.push({ id: 'section-worksheets', label: t('materials.worksheet'), icon: WorksheetIcon })
		}
		if (isLoadingTests || (testsData && testsData.length > 0)) {
			items.push({ id: 'section-tests', label: t('materials.tests'), icon: TestIcon })
		}
		if (isLoadingCards || categories.some(c => c.windowId === 3)) {
			items.push({ id: 'section-games', label: t('materials.games'), icon: GameIcon })
		}
		if (isLoadingCards || categories.some(c => c.windowId === 17)) {
			items.push({ id: 'section-animations', label: t('materials.animations'), icon: AnimationIcon })
		}

		return items
	}, [windowId, isLoadingKmzh, isLoadingCards, isLoadingTests, kmzhData, testsData, categories, t])

	// Show loader only while subject is loading
	if (isLoadingSubject) {
		return <Loader />
	}

	if (hasError) {
		return (
			<main className={s.subjectPage}>
				<Container>
					<ErrorState handleRetry={handleRetry} />
				</Container>
			</main>
		)
	}

	if (!subject) {
		return (
			<main className={s.subjectPage}>
				<Container>
					<EmptyState
						search={subjectCode || ''}
						handleClearSearch={() => window.history.back()}
					/>
				</Container>
			</main>
		)
	}

	// Map category windowId to section id
	const windowIdToSectionId: Record<number, string> = {
		7: 'section-presentations',
		11: 'section-worksheets',
		3: 'section-games',
		17: 'section-animations'
	}

	return (
		<main className={s.subjectPage}>
			<Container>
				<SectionTitle title={subject.name} />

				<GradeQuarterFilter
					grade={grade}
					quarter={quarter}
					onGradeChange={handleGradeChange}
					onQuarterChange={handleQuarterChange}
				/>

				<div className={s.searchRow}>
					<SearchInput
						className={s.searchInput}
						placeholder={t('materials.searchPlaceholder')}
						value={searchInput}
						onChange={e => setSearchInput(e.target.value)}
					/>
					{admin && (
						<Button size="sm" onClick={handleAdminCreate}>
							+ {t('admin.add')}
						</Button>
					)}
				</div>

				{sectionNavItems.length > 0 && (
					<SectionNav items={sectionNavItems} />
				)}

				{windowId && (
					<WindowFilterBadge
						windowName={windowData?.name || t('materials.loading')}
						onReset={handleClearWindow}
					/>
				)}

				{windowId && (
					<FilteredCardsSection
						cards={filteredWindowCards}
						subjectCode={subjectCode || ''}
						hasNextPage={!!hasNextPage}
						isFetchingNextPage={isFetchingNextPage}
						isLocked={isLocked}
						onLoadMore={handleLoadMore}
						showAdminEdit={admin}
						onAdminEdit={handleAdminEdit}
						windowId={windowId}
						subjectId={subject?.id}
						isAdmin={admin}
					onLockedClick={handleLockedClick}
					/>
				)}

				{!windowId && (isLoadingKmzh || (kmzhData && kmzhData.length > 0)) && (
					<KmzhSection
						kmzhData={kmzhData || []}
						subjectCode={subjectCode || ''}
						isLoading={isLoadingKmzh}
						isLocked={isLocked}
						sectionId="section-kmzh"
						onLockedClick={handleLockedClick}
					/>
				)}

				{!windowId &&
					categories.map(category => (
						<MaterialsCategorySection
							key={category.name}
							name={category.name}
							cards={category.cards}
							subjectCode={subjectCode || ''}
							windowId={category.windowId}
							isLocked={isLocked}
							sectionId={windowIdToSectionId[category.windowId]}
							showAdminEdit={admin}
							onAdminEdit={handleAdminEdit}
							subjectId={subject?.id}
							isAdmin={admin}
							onLockedClick={handleLockedClick}
						/>
					))}

				{!windowId && isLoadingCards && categories.length === 0 && (
					<>
						<MaterialsCategorySection
							name={t('materials.presentations')}
							cards={[]}
							subjectCode={subjectCode || ''}
							windowId={7}
							isLoading
							sectionId="section-presentations"
						/>
						<MaterialsCategorySection
							name={t('materials.worksheet')}
							cards={[]}
							subjectCode={subjectCode || ''}
							windowId={11}
							isLoading
							sectionId="section-worksheets"
						/>
					</>
				)}

				{!windowId && (isLoadingTests || (testsData && testsData.length > 0)) && (
					<TestsSection
						testsData={testsData || []}
						isLoading={isLoadingTests}
						isLocked={isLocked}
						sectionId="section-tests"
						onLockedClick={handleLockedClick}
					/>
				)}

				{!windowId && categories.length > 0 && (
					<div className={s.allWindowsLink}>
						<Link to={`/subject-windows/${subjectCode}`}>
							{t('materials.viewAllSections')}
							<ArrowIcon className={s.arrowIcon} />
						</Link>
					</div>
				)}

				{!isLoadingCards && !isLoadingKmzh && !isLoadingTests && totalCards === 0 && (
					<EmptyState
						search={searchInput || ''}
						handleClearSearch={handleClearFilters}
					/>
				)}

				{totalCards > 0 && (
					<div className={s.resultsFooter}>
						{t('materials.totalMaterials')} <strong>{totalCards}</strong>
					</div>
				)}

				{admin && (
					<CardFormModal
						open={cardModalOpen}
						onClose={handleCardModalClose}
						editCardId={editCardId}
						defaultSubjectId={subject?.id}
						defaultWindowId={windowId}
					/>
				)}
			</Container>
			<PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
		</main>
	)
}

export default SubjectsMaterialsPage
