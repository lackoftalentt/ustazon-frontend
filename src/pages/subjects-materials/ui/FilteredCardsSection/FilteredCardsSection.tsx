import type { CardListItem } from '@/entities/card/api/cardApi'
import { SubjectCard } from '@/entities/subject'
import { Button } from '@/shared/ui/button'
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
	if (cards.length === 0) return null

	return (
		<div className={s.windowSection}>
			<div className={s.container}>
				{cards.map(card => (
					<SubjectCard
						key={card.id}
						id={card.id}
						title={card.name}
						description={
							card.description ||
							`${card.topic?.topic || 'Материал'}${card.grade ? ` • ${card.grade}-сынып` : ''}`
						}
						thumbnail={card.img1_url || undefined}
						path={`/subjects-materials/${subjectCode}/detail/${card.id}`}
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
		</div>
	)
}
