import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react'
import { Container } from '@/shared/ui/container'
import { EmptyState } from '@/shared/ui/empty-state'
import { ErrorState } from '@/shared/ui/error-state'
import { Loader } from '@/shared/ui/loader'
import { SectionTitle } from '@/shared/ui/section-title'
import { TopicGraph } from '@/widgets/subject-navigator'
import { Link } from 'react-router-dom'
import { useSubjectMaterialsPage } from '../model/useSubjectMaterialsPage'
import { FilteredCardsSection } from './FilteredCardsSection'
import { KmzhSection } from './KmzhSection'
import { MaterialsCategorySection } from './MaterialsCategorySection'
import s from './SubjectsMaterialsPage.module.scss'
import { TestsSection } from './TestsSection'
import { TopicFilterBadge } from './TopicFilterBadge'
import { WindowFilterBadge } from './WindowFilterBadge'

export const SubjectsMaterialsPage = () => {
	const {
		subjectCode,
		subject,
		windowId,
		windowData,
		selectedTopicId,
		selectedTopic,
		topics,
		categories,
		filteredWindowCards,
		kmzhData,
		testsData,
		isLoading,
		hasError,
		hasNextPage,
		isFetchingNextPage,
		totalCards,
		handleRetry,
		handleClearFilters,
		handleTopicSelect,
		handleClearWindow,
		handleLoadMore
	} = useSubjectMaterialsPage()

	if (isLoading) {
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

	return (
		<main className={s.subjectPage}>
			<Container>
				<SectionTitle title={subject.name} />

				<TopicGraph
					subjectCode={subjectCode || ''}
					topics={topics}
					selectedTopicId={selectedTopicId}
					onTopicSelect={handleTopicSelect}
				/>

				{selectedTopicId !== null && selectedTopic && (
					<TopicFilterBadge
						topicName={selectedTopic.topic}
						subjectCode={subjectCode || ''}
						windowId={windowId}
					/>
				)}

				{windowId && (
					<WindowFilterBadge
						windowName={windowData?.name || 'Жүктелуде...'}
						onReset={handleClearWindow}
					/>
				)}

				{windowId && (
					<FilteredCardsSection
						cards={filteredWindowCards}
						subjectCode={subjectCode || ''}
						hasNextPage={!!hasNextPage}
						isFetchingNextPage={isFetchingNextPage}
						onLoadMore={handleLoadMore}
					/>
				)}

				{!windowId && kmzhData && kmzhData.length > 0 && (
					<KmzhSection
						kmzhData={kmzhData}
						subjectCode={subjectCode || ''}
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
						/>
					))}

				{!windowId && testsData && testsData.length > 0 && (
					<TestsSection
						testsData={testsData}
					/>
				)}

				{!windowId && categories.length > 0 && (
					<div className={s.allWindowsLink}>
						<Link to={`/subject-windows/${subjectCode}`}>
							Барлық бөлімдерді көру
							<ArrowIcon className={s.arrowIcon} />
						</Link>
					</div>
				)}

				{totalCards === 0 && (
					<EmptyState
						search={selectedTopicId?.toString() || ''}
						handleClearSearch={handleClearFilters}
					/>
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
