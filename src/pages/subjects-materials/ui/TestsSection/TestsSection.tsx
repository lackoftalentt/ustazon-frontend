import type { Test } from '@/entities/test'
import { TestItem } from '@/entities/test'
import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react'
import { SectionTitle } from '@/shared/ui/section-title'
import { SkeletonCard } from '@/shared/ui/skeleton-card'
import { Link } from 'react-router-dom'
import s from '../SubjectsMaterialsPage.module.scss'

interface TestsSectionProps {
	testsData: Test[]
	isLoading?: boolean
	isLocked?: boolean
	sectionId?: string
}

export const TestsSection = ({ testsData, isLoading, isLocked, sectionId }: TestsSectionProps) => {
	if (isLoading) {
		return (
			<div className={s.windowSection} id={sectionId}>
				<SectionTitle className={s.rowTitle} title="Тесттер" />
				<div className={s.container}>
					{Array.from({ length: 4 }).map((_, i) => (
						<SkeletonCard key={i} />
					))}
				</div>
			</div>
		)
	}

	const displayItems = testsData.slice(0, 4)
	const hasMore = testsData.length > 3

	return (
		<div className={s.windowSection} id={sectionId}>
			<SectionTitle
				className={s.rowTitle}
				title="Тесттер"
			/>
			<div className={s.container}>
				{displayItems.map(test => (
					<TestItem
						key={test.id}
						id={String(test.id)}
						title={test.title}
						description={test.subject}
						questionsCount={test.questions_count}
						timeLimit={test.duration}
						difficulty={test.difficulty}
						category={test.subject}
						isLocked={isLocked}
					/>
				))}
			</div>
			{hasMore && (
				<div className={s.showMoreWrapper}>
					<Link
						to={`/tests`}
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
