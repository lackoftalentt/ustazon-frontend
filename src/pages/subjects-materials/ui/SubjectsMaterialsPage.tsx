import { useCards } from '@/entities/card/model/useCards'
import { useSubjectByCode } from '@/entities/subject/model/useSubjects'
import { SubjectCard } from '@/entities/subject/ui'
import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react'
import { Container } from '@/shared/ui/container'
import { Loader } from '@/shared/ui/loader'
import { SectionTitle } from '@/shared/ui/section-title'
import { TopicGraph } from '@/widgets/subject-navigator'
import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import s from './SubjectsMaterialsPage.module.scss'

export const SubjectsMaterialsPage = () => {
	const { subjectCode } = useParams<{ subjectCode: string }>()
	const [searchParams, setSearchParams] = useSearchParams()

	const selectedTopicId = searchParams.get('topic')
	const selectedWindowId = searchParams.get('window')

	const { data: subject, isLoading: isLoadingSubject } = useSubjectByCode(
		subjectCode || '',
		!!subjectCode
	)

	const topicId = selectedTopicId ? parseInt(selectedTopicId) : undefined
	const windowId = selectedWindowId ? parseInt(selectedWindowId) : undefined

	// Маппинг window_id к названиям категорий
	const windowNames: Record<number, string> = {
		19: 'ҚМЖ',
		7: 'Презентациялар',
		11: 'Жұмыс парағы',
		3: 'Ойындар',
		17: 'Анимациялар'
	}

	// Если выбран конкретный window - делаем только один запрос
	const { data: filteredWindowCards, isLoading: isLoadingFiltered } = useCards(
		subject?.id && windowId
			? { subject_id: subject.id, window_id: windowId, topic_id: topicId, limit: 50 }
			: undefined
	)

	// Запросы для всех категорий (только если не выбран конкретный window)
	const { data: kmjCards, isLoading: isLoadingKmj } = useCards(
		subject?.id && !windowId
			? { subject_id: subject.id, window_id: 19, topic_id: topicId, limit: 20 }
			: undefined
	)

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

	const allCards = useMemo(() => {
		return [
			...(kmjCards || []),
			...(presentationCards || []),
			...(worksheetCards || []),
			...(gamesCards || []),
			...(animationCards || [])
		]
	}, [kmjCards, presentationCards, worksheetCards, gamesCards, animationCards])

	const topics = useMemo(() => {
		if (!allCards.length) return []

		const gradeQuarterTopics = new Map<string, any>()

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
						const quarterNode = {
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
						if (!quarterNode.children.find((t: any) => t.id === topic.id)) {
							quarterNode.children.push({
								...topic,
								children: topic.children || []
							})
						}
					}
				} else if (topic) {
					const gradeNode = gradeQuarterTopics.get(gradeKey)!
					if (!gradeNode.children.find((t: any) => t.id === topic.id)) {
						gradeNode.children.push({
							...topic,
							children: topic.children || []
						})
					}
				}
			} else if (topic) {
				const topicKey = `topic-${topic.id}`
				if (!gradeQuarterTopics.has(topicKey)) {
					gradeQuarterTopics.set(topicKey, {
						...topic,
						children: topic.children || []
					})
				}
			}
		})

		return Array.from(gradeQuarterTopics.values()).filter(
			node => node.parent_topic_id === null
		)
	}, [allCards])

	const categories = useMemo(() => {
		const result: {
			name: string
			cards: NonNullable<typeof kmjCards>
			windowId: number
		}[] = []

		if (kmjCards && kmjCards.length > 0) {
			result.push({ name: 'ҚМЖ', cards: kmjCards, windowId: 19 })
		}
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
	}, [kmjCards, presentationCards, worksheetCards, gamesCards, animationCards])

	const isLoading = windowId
		? isLoadingSubject || isLoadingFiltered
		: isLoadingSubject ||
		  isLoadingKmj ||
		  isLoadingPresentations ||
		  isLoadingWorksheets ||
		  isLoadingGames ||
		  isLoadingAnimations

	const totalCards = windowId
		? filteredWindowCards?.length || 0
		: categories.reduce((sum, cat) => sum + cat.cards.length, 0)

	if (isLoading) {
		return <Loader />
	}

	if (!subject) {
		return (
			<main className={s.subjectPage}>
				<Container>
					<div style={{ textAlign: 'center', padding: '80px 0' }}>
						Пән табылмады
					</div>
				</Container>
			</main>
		)
	}

	const selectedTopic = topics.find(
		t => t.id === parseInt(selectedTopicId || '0')
	)

	return (
		<main className={s.subjectPage}>
			<Container>
				<SectionTitle title={subject.name} />

				<TopicGraph
					subjectCode={subjectCode || ''}
					topics={topics || []}
					selectedTopicId={selectedTopicId ? parseInt(selectedTopicId) : null}
					onTopicSelect={topicIdValue => {
						if (topicIdValue === null) {
							searchParams.delete('topic')
						} else {
							searchParams.set('topic', topicIdValue.toString())
						}
						setSearchParams(searchParams)
					}}
				/>

				{selectedTopicId && selectedTopic && (
					<div className={s.topicFilter}>
						<div className={s.topicFilterContent}>
							<div className={s.topicFilterIcon}>📚</div>
							<span>
								Тақырып: <strong>{selectedTopic.topic}</strong>
							</span>
						</div>
						<Link
							to={`/subjects-materials/${subjectCode}${windowId ? `?window=${windowId}` : ''}`}
							className={s.topicFilterReset}
						>
							Тақырыпты алып тастау
						</Link>
					</div>
				)}

				{windowId && (
					<div className={s.windowFilter}>
						<div className={s.windowFilterTitle}>
							{windowNames[windowId] || `Window ID: ${windowId}`}
						</div>
						<button
							onClick={() => {
								searchParams.delete('window')
								setSearchParams(searchParams)
							}}
							className={s.windowFilterReset}
						>
							Сбросить
							<span className={s.resetIcon}>✕</span>
						</button>
					</div>
				)}

				{/* Отображение карточек при выбранном window */}
				{windowId && filteredWindowCards && (
					<div className={s.windowSection}>
						<div className={s.container}>
							{filteredWindowCards.map(card => (
								<SubjectCard
									key={card.id}
									id={card.id}
									title={card.name}
									description={
										card.description ||
										`${card.topic?.topic || 'Материал'}${
											card.grade ? ` • ${card.grade}-сынып` : ''
										}`
									}
									thumbnail={card.img1_url || undefined}
									path={`/subjects-materials/${subjectCode}/detail/${card.id}`}
								/>
							))}
						</div>
					</div>
				)}

				{/* Отображение категорий когда window не выбран */}
				{!windowId &&
					categories.map(({ name, cards: categoryCards, windowId: catWindowId }) => {
						const displayCards = categoryCards.slice(0, 3)
						const hasMore = categoryCards.length > 3

						return (
							<div
								key={name}
								className={s.windowSection}
							>
								<SectionTitle
									className={s.rowTitle}
									title={name}
								/>
								<div className={s.container}>
									{displayCards.map(card => (
										<SubjectCard
											key={card.id}
											id={card.id}
											title={card.name}
											description={
												card.description ||
												`${card.topic?.topic || 'Материал'}${
													card.grade ? ` • ${card.grade}-сынып` : ''
												}`
											}
											thumbnail={card.img1_url || undefined}
											path={`/subjects-materials/${subjectCode}/detail/${card.id}`}
										/>
									))}
								</div>
								{hasMore && (
									<div className={s.showMoreWrapper}>
										<Link
											to={`/subjects-materials/${subjectCode}?window=${catWindowId}`}
											className={s.showMoreLink}
										>
											Көбірек көру
											<ArrowIcon className={s.arrowIcon} />
										</Link>
									</div>
								)}
							</div>
						)
					})}

				{!windowId && categories.length > 0 && (
					<div className={s.allWindowsLink}>
						<Link to={`/subject-windows/${subjectCode}`}>
							Барлық материалдарды көру
							<ArrowIcon className={s.arrowIcon} />
						</Link>
					</div>
				)}

				{totalCards === 0 && (
					<div className={s.noResults}>
						<div className={s.noResultsIcon}>📚</div>
						<div className={s.noResultsTitle}>Материалдар жоқ</div>
					</div>
				)}

				{totalCards > 0 && (
					<div className={s.resultsFooter}>
						Барлық материалдар: <strong>{totalCards}</strong>
					</div>
				)}
			</Container>
		</main>
	)
}
export default SubjectsMaterialsPage
