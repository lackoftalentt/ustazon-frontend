import type { CardDetailResponse } from '@/entities/card/api/cardApi'
import { useNavigate } from 'react-router-dom'
import s from './SubjectDetailSidebar.module.scss'

interface SubjectDetailSidebarProps {
	lesson: CardDetailResponse
}

export const SubjectDetailSidebar = ({ lesson }: SubjectDetailSidebarProps) => {
	const navigate = useNavigate()

	const quarterLabel = lesson.quarter ? `${lesson.quarter} тоқсан` : null
	const gradeLabel = lesson.grade ? `${lesson.grade} сынып` : null
	const institutionType = lesson.institution_types?.[0]?.name ?? null
	const topicName = lesson.topic?.topic ?? null

	return (
		<aside className={s.root}>
			<h2 className={s.heading}>Маңызды ақпарат</h2>

			<div className={s.cards}>
				<button
					className={s.card}
					onClick={() => navigate('/tests')}
				>
					<div className={s.cardMeta}>
						<span className={s.cardLabel}>Тапсырмалар</span>
						{/* <span className={s.cardSub}>Тесттер саны: 3</span> */}
					</div>
					<span className={s.cardAction}>Өту</span>
				</button>

				{topicName && (
					<div className={s.card}>
						<div className={s.cardMeta}>
							<span className={s.cardLabel}>Бөлім</span>
							<span className={s.cardSub}>{topicName}</span>
						</div>
					</div>
				)}

				{institutionType && (
					<div className={s.card}>
						<div className={s.cardMeta}>
							<span className={s.cardLabel}>Оқу материалы</span>
							<span className={s.cardSub}>{institutionType}</span>
						</div>
					</div>
				)}
			</div>

			<div className={s.divider} />

			<div className={s.stats}>
				{gradeLabel && (
					<div className={s.stat}>
						<div className={s.statValue}>{lesson.grade}</div>
						<div className={s.statLabel}>Сынып</div>
					</div>
				)}
				{quarterLabel && (
					<div className={s.stat}>
						<div className={s.statValue}>{lesson.quarter}</div>
						<div className={s.statLabel}>Тоқсан</div>
					</div>
				)}
			</div>

			<button
				className={s.backBtn}
				onClick={() => navigate(-1)}
			>
				<span className={s.backIcon} />
				Артқа қайту
			</button>
		</aside>
	)
}
