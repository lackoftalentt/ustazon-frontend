import type { CardListItem } from '@/entities/card/api/cardApi'
import { useCards, useInfiniteCards } from '@/entities/card/model/useCards'
import { useKmzhList } from '@/entities/kmzh'
import {
	useSubjectByCode,
	useWindow
} from '@/entities/subject/model/useSubjects'
import { useSubscriptionCheck } from '@/entities/subscription'
import { useAuthStore } from '@/entities/user/model/store/useAuthStore'
import { useTests } from '@/entities/test'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

const PAGE_SIZE = 50

const SUBJECT_MAP: Record<string, string> = {
	'algebra,geometry': 'Математика'
}

export const MATERIAL_WINDOWS = [
	{ name: 'Презентациялар', id: 7 },
	{ name: 'Жұмыс парағы', id: 11 },
	{ name: 'Ойындар', id: 3 },
	{ name: 'Анимациялар', id: 17 }
] as const

interface CategoryData {
	name: string
	cards: CardListItem[]
	windowId: number
}

export const useSubjectMaterialsPage = () => {
	const { subjectCode } = useParams<{ subjectCode: string }>()
	const [searchParams, setSearchParams] = useSearchParams()

	// URL params: grade, quarter, window
	const urlGrade = searchParams.get('grade')
	const urlQuarter = searchParams.get('quarter')
	const urlWindowId = searchParams.get('window')

	const grade = urlGrade ? parseInt(urlGrade) : null
	const quarter = urlQuarter ? parseInt(urlQuarter) : null
	const windowId = urlWindowId ? parseInt(urlWindowId) : undefined

	// Local search state with debounce
	const [searchInput, setSearchInput] = useState('')
	const [debouncedSearch, setDebouncedSearch] = useState('')

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(searchInput), 300)
		return () => clearTimeout(timer)
	}, [searchInput])

	const searchParam = debouncedSearch.length >= 2 ? debouncedSearch : undefined

	// Subject query
	const {
		data: subject,
		isLoading: isLoadingSubject,
		error: subjectError,
		refetch: refetchSubject
	} = useSubjectByCode(subjectCode || '', { enabled: !!subjectCode })

	// Subscription check (backend returns has_subscription=true for admins)
	const isAuthenticated = useAuthStore(state => state.isAuthenticated)()
	const { data: subscriptionData } = useSubscriptionCheck(
		isAuthenticated ? subject?.id : undefined
	)
	const isLocked = useMemo(() => {
		if (!isAuthenticated) return true
		return subscriptionData ? !subscriptionData.has_subscription : false
	}, [isAuthenticated, subscriptionData])

	// Window data for filtered view
	const { data: windowData } = useWindow(windowId || 0, !!windowId)

	// Infinite cards for filtered window view
	const {
		data: filteredWindowCardsData,
		isLoading: isLoadingFiltered,
		error: filteredError,
		refetch: refetchFiltered,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useInfiniteCards(
		subject?.id && windowId
			? {
					subject_id: subject.id,
					window_id: windowId,
					...(grade !== null ? { grade } : {}),
					...(quarter !== null ? { quarter } : {}),
					...(searchParam ? { search: searchParam } : {})
				}
			: undefined,
		PAGE_SIZE
	)

	const filteredWindowCards = useMemo(
		() => filteredWindowCardsData?.pages.flat() || [],
		[filteredWindowCardsData]
	)

	// Build common filters for card queries
	const baseCardFilters = useMemo(() => {
		if (!subject?.id || windowId) return null
		return {
			subject_id: subject.id,
			...(grade !== null ? { grade } : {}),
			...(quarter !== null ? { quarter } : {}),
			...(searchParam ? { search: searchParam } : {})
		}
	}, [subject?.id, windowId, grade, quarter, searchParam])

	// Cards queries for each window (only when no specific window is selected)
	const { data: presentationCards, isLoading: isLoadingPresentations } =
		useCards(
			baseCardFilters
				? { ...baseCardFilters, window_id: 7, limit: 20 }
				: undefined
		)

	const { data: worksheetCards, isLoading: isLoadingWorksheets } = useCards(
		baseCardFilters
			? { ...baseCardFilters, window_id: 11, limit: 20 }
			: undefined
	)

	const { data: gamesCards, isLoading: isLoadingGames } = useCards(
		baseCardFilters
			? { ...baseCardFilters, window_id: 3, limit: 20 }
			: undefined
	)

	const { data: animationCards, isLoading: isLoadingAnimations } = useCards(
		baseCardFilters
			? { ...baseCardFilters, window_id: 17, limit: 20 }
			: undefined
	)

	// Categories for display
	const categories = useMemo((): CategoryData[] => {
		const result: CategoryData[] = []

		if (presentationCards && presentationCards.length > 0) {
			result.push({
				name: 'Презентациялар',
				cards: presentationCards,
				windowId: 7
			})
		}
		if (worksheetCards && worksheetCards.length > 0) {
			result.push({ name: 'Жұмыс парағы', cards: worksheetCards, windowId: 11 })
		}
		if (gamesCards && gamesCards.length > 0) {
			result.push({ name: 'Ойындар', cards: gamesCards, windowId: 3 })
		}
		if (animationCards && animationCards.length > 0) {
			result.push({ name: 'Анимациялар', cards: animationCards, windowId: 17 })
		}

		return result
	}, [presentationCards, worksheetCards, gamesCards, animationCards])

	// Subject param for KMZH/Tests
	const subjectParam = subjectCode
		? (SUBJECT_MAP[subjectCode] ?? subjectCode)
		: undefined

	// KMZH data — pass grade/quarter filters
	const {
		data: kmzhData,
		isLoading: isLoadingKmzh,
		error: kmzhError,
		refetch: refetchKmzh
	} = useKmzhList(
		!windowId
			? {
					limit: PAGE_SIZE,
					...(grade !== null ? { grade } : {}),
					...(quarter !== null ? { quarter } : {})
				}
			: undefined,
		subjectCode
	)

	// Tests data
	const {
		data: testsData,
		isLoading: isLoadingTests,
		error: testsError,
		refetch: refetchTests
	} = useTests(
		{ subject: subjectParam, limit: PAGE_SIZE },
		!windowId && !!subjectCode
	)

	// Client-side filter for KMZH/Tests by search
	const filteredKmzh = useMemo(() => {
		if (!kmzhData) return undefined
		if (!debouncedSearch) return kmzhData
		const q = debouncedSearch.toLowerCase()
		return kmzhData.filter(k => k.title.toLowerCase().includes(q))
	}, [kmzhData, debouncedSearch])

	const filteredTests = useMemo(() => {
		if (!testsData) return undefined
		if (!debouncedSearch) return testsData
		const q = debouncedSearch.toLowerCase()
		return testsData.filter(t => t.title.toLowerCase().includes(q))
	}, [testsData, debouncedSearch])

	// Loading states — per section, not global
	const isLoadingCards = isLoadingPresentations || isLoadingWorksheets || isLoadingGames || isLoadingAnimations

	// Error state
	const hasError = windowId
		? subjectError || filteredError
		: subjectError || kmzhError || testsError

	// Handlers
	const handleRetry = useCallback(() => {
		if (subjectError) refetchSubject()
		if (windowId) {
			if (filteredError) refetchFiltered()
		} else {
			if (kmzhError) refetchKmzh()
			if (testsError) refetchTests()
		}
	}, [
		subjectError,
		filteredError,
		kmzhError,
		testsError,
		windowId,
		refetchSubject,
		refetchFiltered,
		refetchKmzh,
		refetchTests
	])

	const handleClearFilters = useCallback(() => {
		searchParams.delete('grade')
		searchParams.delete('quarter')
		searchParams.delete('window')
		setSearchParams(searchParams)
		setSearchInput('')
	}, [searchParams, setSearchParams])

	const handleGradeChange = useCallback(
		(newGrade: number | null) => {
			if (newGrade === null) {
				searchParams.delete('grade')
			} else {
				searchParams.set('grade', newGrade.toString())
			}
			setSearchParams(searchParams)
		},
		[searchParams, setSearchParams]
	)

	const handleQuarterChange = useCallback(
		(newQuarter: number | null) => {
			if (newQuarter === null) {
				searchParams.delete('quarter')
			} else {
				searchParams.set('quarter', newQuarter.toString())
			}
			setSearchParams(searchParams)
		},
		[searchParams, setSearchParams]
	)

	const handleClearWindow = useCallback(() => {
		searchParams.delete('window')
		setSearchParams(searchParams)
	}, [searchParams, setSearchParams])

	const handleLoadMore = useCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	// Total cards count
	const totalCards = windowId
		? filteredWindowCards.length
		: categories.reduce((sum, cat) => sum + cat.cards.length, 0) +
			(filteredKmzh?.length || 0) +
			(filteredTests?.length || 0)

	return {
		// Subject
		subjectCode,
		subject,

		// Filters
		grade,
		quarter,
		windowId,
		windowData,
		searchInput,

		// Data
		categories,
		filteredWindowCards,
		kmzhData: filteredKmzh,
		testsData: filteredTests,

		// Subscription
		isLocked,

		// Loading states (per-section)
		isLoadingSubject,
		isLoadingCards,
		isLoadingFiltered,
		isLoadingKmzh,
		isLoadingTests,

		// State
		hasError,
		hasNextPage,
		isFetchingNextPage,
		totalCards,

		// Handlers
		handleRetry,
		handleClearFilters,
		handleGradeChange,
		handleQuarterChange,
		handleClearWindow,
		handleLoadMore,
		setSearchInput
	}
}
