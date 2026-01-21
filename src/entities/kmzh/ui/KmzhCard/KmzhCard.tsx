import Arrow from '@/shared/assets/icons/arrowLeft.svg?react'
import { Button } from '@/shared/ui/button'
import { Link } from 'react-router-dom'
import s from './KmzhCard.module.scss'

interface KmzhCardProps {
	id: number
	title: string
	grade: number
	quarter: number
	hour: number
	code: string
	filesCount: number
	path?: string
}

export const KmzhCard = ({
	id,
	title,
	grade,
	quarter,
	hour,
	code,
	filesCount,
	path
}: KmzhCardProps) => {
	const linkPath = path || `/kmzh/detail/${id}`

	return (
		<article className={s.card}>
			<div className={s.header}>
				<span className={s.grade}>{grade}-сынып</span>
				<span className={s.quarter}>{quarter}-тоқсан</span>
			</div>
			<div className={s.container}>
				<h3 className={s.title}>{title}</h3>
				<div className={s.meta}>
					<span className={s.metaItem}>Код: {code}</span>
					<span className={s.metaItem}>{hour} сағат</span>
					<span className={s.metaItem}>{filesCount} файл</span>
				</div>
				<Link to={linkPath} className={s.link}>
					<Button className={s.button}>
						Қарау
						<Arrow className={s.arrowIcon} />
					</Button>
				</Link>
			</div>
		</article>
	)
}
