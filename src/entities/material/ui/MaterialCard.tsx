import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '@/shared/ui/button'
import { type SavedMaterial, materialTypeBadgeLabels } from '../model/types'
import s from './MaterialCard.module.scss'

interface MaterialCardProps {
	material: SavedMaterial
}

const badgeClassMap: Record<SavedMaterial['type'], string> = {
	card: s.badgeCard,
	test: s.badgeTest,
	kmzh: s.badgeKmzh,
	presentation: s.badgePresentation
}

export const MaterialCard = ({ material }: MaterialCardProps) => {
	const { title, description, type, thumbnail, path, subjectName } = material

	return (
		<article className={s.card}>
			<div className={s.thumbnail}>
				{thumbnail && (
					<img
						src={thumbnail}
						alt={title}
						className={s.thumbnailImage}
					/>
				)}
				<span className={clsx(s.badge, badgeClassMap[type])}>
					{materialTypeBadgeLabels[type]}
				</span>
			</div>
			<div className={s.content}>
				{subjectName && <span className={s.subject}>{subjectName}</span>}
				<h3 className={s.title}>{title}</h3>
				{description && <p className={s.description}>{description}</p>}
				<Link
					to={path}
					className={s.link}
				>
					<Button className={s.button}>
						<Eye size={18} />
						Көру
					</Button>
				</Link>
			</div>
		</article>
	)
}
