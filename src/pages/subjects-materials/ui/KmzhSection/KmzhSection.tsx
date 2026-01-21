import type { KmzhItem } from '@/entities/kmzh'
import { KmzhCard } from '@/entities/kmzh'
import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react'
import { SectionTitle } from '@/shared/ui/section-title'
import { Link } from 'react-router-dom'
import s from '../SubjectsMaterialsPage.module.scss'

interface KmzhSectionProps {
	kmzhData: KmzhItem[]
	subjectCode: string
}

export const KmzhSection = ({ kmzhData, subjectCode }: KmzhSectionProps) => {
	const displayItems = kmzhData.slice(0, 3)
	const hasMore = kmzhData.length > 3

	return (
		<div className={s.windowSection}>
			<SectionTitle className={s.rowTitle} title="ҚМЖ" />
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
					/>
				))}
			</div>
			{hasMore && (
				<div className={s.showMoreWrapper}>
					<Link to={`/lesson-plans/${subjectCode}`} className={s.showMoreLink}>
						Көбірек көру
						<ArrowIcon className={s.arrowIcon} />
					</Link>
				</div>
			)}
		</div>
	)
}
