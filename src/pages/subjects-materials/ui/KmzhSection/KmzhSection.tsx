import type { KmzhItem } from '@/entities/kmzh'
import { KmzhCard } from '@/entities/kmzh'
import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react'
import { SectionTitle } from '@/shared/ui/section-title'
import { SkeletonCard } from '@/shared/ui/skeleton-card'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import s from '../SubjectsMaterialsPage.module.scss'

interface KmzhSectionProps {
	kmzhData: KmzhItem[]
	subjectCode: string
	isLoading?: boolean
	isLocked?: boolean
	sectionId?: string
	onLockedClick?: () => void
}

export const KmzhSection = ({ kmzhData, subjectCode, isLoading, isLocked, sectionId, onLockedClick }: KmzhSectionProps) => {
	const { t } = useTranslation()

	if (isLoading) {
		return (
			<div className={s.windowSection} id={sectionId}>
				<SectionTitle className={s.rowTitle} title={t('kmzhSection.title')} />
				<div className={s.container}>
					{Array.from({ length: 4 }).map((_, i) => (
						<SkeletonCard key={i} />
					))}
				</div>
			</div>
		)
	}

	const displayItems = kmzhData.slice(0, 4)
	const hasMore = kmzhData.length > 3

	return (
		<div className={s.windowSection} id={sectionId}>
			<SectionTitle
				className={s.rowTitle}
				title={t('kmzhSection.title')}
			/>
			<div className={s.container}>
				{displayItems.map(kmzh => (
					<KmzhCard
						key={kmzh.id}
						id={kmzh.id}
						title={kmzh.title}
						grade={kmzh.grade}
						quarter={kmzh.quarter}
						hour={kmzh.hour}
						code={kmzh.code}
						filesCount={kmzh.files_count}
						path={`/lesson-plans-list/${kmzh.grade}/q${kmzh.quarter}?code=${subjectCode}`}
						isLocked={isLocked}
						onLockedClick={onLockedClick}
					/>
				))}
			</div>
			{hasMore && (
				<div className={s.showMoreWrapper}>
					<Link
						to={`/lesson-plans/${subjectCode}`}
						className={s.showMoreLink}
					>
						{t('kmzhSection.showMore')}
						<ArrowIcon className={s.arrowIcon} />
					</Link>
				</div>
			)}
		</div>
	)
}
