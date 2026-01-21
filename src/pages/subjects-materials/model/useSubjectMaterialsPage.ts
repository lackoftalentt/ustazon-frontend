import type { CardListItem } from '@/entities/card/api/cardApi'
import { useCards, useInfiniteCards } from '@/entities/card/model/useCards'
import { useKmzhList } from '@/entities/kmzh'
import {
	useSubjectByCode,
	useWindow
} from '@/entities/subject/model/useSubjects'
import { useTests } from '@/entities/test'
import { useCallback, useMemo } from 'react'
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

interface TopicNode {
	id: number
	topic: string
	parent_topic_id: number | null
	children: TopicNode[]
}

interface CategoryData {
	name: string
	cards: CardListItem[]
	windowId: number
}

export const useSubjectMaterialsPage = () => {
	const { subjectCode } = useParams<{ subjectCode: string }>()
	const [searchParams, setSearchParams] = useSearchParams()

	// URL params
	const urlTopicId = searchParams.get('topic')
	const urlWindowId = searchParams.get('window')
	const topicId = urlTopicId ? parseInt(urlTopicId) : undefined
	const windowId = urlWindowId ? parseInt(urlWindowId) : undefined

	// Subject query
	const {
		data: subject,
		isLoading: isLoadingSubject,
		error: subjectError,
		refetch: refetchSubject
	} = useSubjectByCode(subjectCode || '', { enabled: !!subjectCode })

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
			? { subject_id: subject.id, window_id: windowId, topic_id: topicId }
			: undefined,
		PAGE_SIZE
	)

	const filteredWindowCards = useMemo(
		() => filteredWindowCardsData?.pages.flat() || [],
		[filteredWindowCardsData]
	)

	// Cards queries for each window (only when no specific window is selected)
	const { data: presentationCards, isLoading: isLoadingPresentations } =
		useCards(
			subject?.id && !windowId
				? { subject_id: subject.id, window_id: 7, topic_id: topicId, limit: 20 }
				: undefined
		)

	const { data: worksheetCards, isLoading: isLoadingWorksheets } = useCards(
		subject?.id && !windowId
			? { subject_id: subject.id, window_id: 11, topic_id: topicId, limit: 20 }
			: undefined
	)

	const { data: gamesCards, isLoading: isLoadingGames } = useCards(
		subject?.id && !windowId
			? { subject_id: subject.id, window_id: 3, topic_id: topicId, limit: 20 }
			: undefined
	)

	const { data: animationCards, isLoading: isLoadingAnimations } = useCards(
		subject?.id && !windowId
			? { subject_id: subject.id, window_id: 17, topic_id: topicId, limit: 20 }
			: undefined
	)

	// All cards for topic tree
	const allCards = useMemo(() => {
		return [
			...(presentationCards || []),
			...(worksheetCards || []),
			...(gamesCards || []),
			...(animationCards || [])
		]
	}, [presentationCards, worksheetCards, gamesCards, animationCards])

	// Build topics from cards
	const topics = useMemo((): TopicNode[] => {
		if (!allCards.length) return []

		const gradeQuarterTopics = new Map<string, TopicNode>()

		allCards.forEach(card => {
			const grade = card.grade
			const quarter = card.quarter
			const topic = card.topic

			if (grade !== null && grade !== undefined) {
				const gradeKey = `grade-${grade}`
				if (!gradeQuarterTopics.has(gradeKey)) {
					gradeQuarterTopics.set(gradeKey, {
						id: -1000 - grade,
						topic: `${grade}-сынып`,
						parent_topic_id: null,
						children: []
					})
				}

				if (quarter !== null && quarter !== undefined) {
					const quarterKey = `grade-${grade}-quarter-${quarter}`
					if (!gradeQuarterTopics.has(quarterKey)) {
						const quarterNode: TopicNode = {
							id: -2000 - (grade * 10 + quarter),
							topic: `${quarter}-тоқсан`,
							parent_topic_id: -1000 - grade,
							children: []
						}
						gradeQuarterTopics.set(quarterKey, quarterNode)
						gradeQuarterTopics.get(gradeKey)!.children.push(quarterNode)
					}

					if (topic) {
						const quarterNode = gradeQuarterTopics.get(quarterKey)!
						if (!quarterNode.children.find(t => t.id === topic.id)) {
							quarterNode.children.push({
								id: topic.id,
								topic: topic.topic,
								parent_topic_id: quarterNode.id,
								children: []
							})
						}
					}
				} else if (topic) {
					const gradeNode = gradeQuarterTopics.get(gradeKey)!
					if (!gradeNode.children.find(t => t.id === topic.id)) {
						gradeNode.children.push({
							id: topic.id,
							topic: topic.topic,
							parent_topic_id: gradeNode.id,
							children: []
						})
					}
				}
			} else if (topic) {
				const topicKey = `topic-${topic.id}`
				if (!gradeQuarterTopics.has(topicKey)) {
					gradeQuarterTopics.set(topicKey, {
						id: topic.id,
						topic: topic.topic,
						parent_topic_id: null,
						children: []
					})
				}
			}
		})

		return Array.from(gradeQuarterTopics.values()).filter(
			node => node.parent_topic_id === null
		)
	}, [allCards])

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

	// KMZH data
	const {
		data: kmzhData,
		isLoading: isLoadingKmzh,
		error: kmzhError,
		refetch: refetchKmzh
	} = useKmzhList(!windowId ? { limit: PAGE_SIZE } : undefined, subjectCode)

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

	// Find selected topic
	const findTopicNode = (tree: TopicNode[], id: number): TopicNode | null => {
		for (const node of tree) {
			if (node.id === id) return node
			const found = findTopicNode(node.children, id)
			if (found) return found
		}
		return null
	}

	const selectedTopicId = urlTopicId ? parseInt(urlTopicId) : null
	const selectedTopic = useMemo(
		() =>
			selectedTopicId !== null ? findTopicNode(topics, selectedTopicId) : null,
		[topics, selectedTopicId]
	)

	// Loading state
	const isLoading = windowId
		? isLoadingSubject || isLoadingFiltered
		: isLoadingSubject ||
			isLoadingPresentations ||
			isLoadingWorksheets ||
			isLoadingGames ||
			isLoadingAnimations ||
			isLoadingKmzh ||
			isLoadingTests

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
		searchParams.delete('topic')
		searchParams.delete('window')
		setSearchParams(searchParams)
	}, [searchParams, setSearchParams])

	const handleTopicSelect = useCallback(
		(topicIdValue: number | null) => {
			if (topicIdValue === null) {
				searchParams.delete('topic')
			} else {
				searchParams.set('topic', topicIdValue.toString())
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
			(kmzhData?.length || 0) +
			(testsData?.length || 0)

	return {
		// Subject
		subjectCode,
		subject,

		// Filters
		windowId,
		windowData,
		selectedTopicId,
		selectedTopic,

		// Data
		topics,
		categories,
		filteredWindowCards,
		kmzhData,
		testsData,

		// State
		isLoading,
		hasError,
		hasNextPage,
		isFetchingNextPage,
		totalCards,

		// Handlers
		handleRetry,
		handleClearFilters,
		handleTopicSelect,
		handleClearWindow,
		handleLoadMore
	}
}
