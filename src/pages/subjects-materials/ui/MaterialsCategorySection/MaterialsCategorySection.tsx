import type { CardListItem } from '@/entities/card/api/cardApi'
import { SubjectCard } from '@/entities/subject'
import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react'
import { SectionTitle } from '@/shared/ui/section-title'
import { Link } from 'react-router-dom'
import s from '../SubjectsMaterialsPage.module.scss'

interface MaterialsCategorySectionProps {
	name: string
	cards: CardListItem[]
	subjectCode: string
	windowId: number
}

export const MaterialsCategorySection = ({
	name,
	cards,
	subjectCode,
	windowId
}: MaterialsCategorySectionProps) => {
	const displayCards = cards.slice(0, 3)
	const hasMore = cards.length > 3

	return (
		<div className={s.windowSection}>
			<SectionTitle className={s.rowTitle} title={name} />
			<div className={s.container}>
				{displayCards.map(card => (
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
		</div>
	)
}
