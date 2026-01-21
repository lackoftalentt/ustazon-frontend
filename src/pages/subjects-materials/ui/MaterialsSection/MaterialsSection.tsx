import type { CardListItem } from '@/entities/card/api/cardApi'
import { SubjectCard } from '@/entities/subject'
import { getWindowName } from '@/entities/window'
import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react'
import { SectionTitle } from '@/shared/ui/section-title'
import { Link } from 'react-router-dom'
import s from './MaterialsSection.module.scss'

interface MaterialsSectionProps {
	windowId: number | null
	cards: CardListItem[]
	subjectCode: string
	isFiltered: boolean
	showMoreLink: string
}

export const MaterialsSection = ({
	windowId,
	cards,
	subjectCode,
	isFiltered,
	showMoreLink
}: MaterialsSectionProps) => {
	const displayCards = isFiltered ? cards : cards.slice(0, 3)
	const hasMore = !isFiltered && cards.length > 3

	return (
		<div className={s.section}>
			{!isFiltered && <SectionTitle title={getWindowName(windowId)} />}
			<div className={s.container}>
				{displayCards.map(card => (
					<SubjectCard
						key={card.id}
						id={card.id}
						title={card.name}
						description={
							card.description ||
							`${card.topic?.topic || 'Материал'}${
								card.grade ? ` • ${card.grade} класс` : ''
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
						to={showMoreLink}
						className={s.showMoreLink}
					>
						Показать больше
						<ArrowIcon className={s.arrowIcon} />
					</Link>
				</div>
			)}
		</div>
	)
}
