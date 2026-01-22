import CardPlaceholder from '@/shared/assets/images/card-placeholder.png'
import { Button } from '@/shared/ui/button'
import clsx from 'clsx'
import { Eye, Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import s from './MaterialCard.module.scss'

interface MaterialCardProps {
	id: number
	title: string
	description?: string | null
	thumbnail?: string | null
	path: string
	subjectName?: string
	templateName?: string | null
	isFavorite?: boolean
	showDelete?: boolean
	onFavoriteToggle?: (id: number) => void
	onDelete?: (id: number) => void
}

const badgeClassMap: Record<string, string> = {
	карточка: s.badgeCard,
	тест: s.badgeTest,
	қмж: s.badgeKmzh,
	презентация: s.badgePresentation,
	'жұмыс парағы': s.badgeCard,
	ойын: s.badgeTest,
	анимация: s.badgePresentation
}

export const MaterialCard = ({
	id,
	title,
	description,
	thumbnail,
	path,
	subjectName,
	templateName,
	isFavorite = false,
	showDelete = true,
	onFavoriteToggle,
	onDelete
}: MaterialCardProps) => {
	const normalizedThumbnail =
		thumbnail &&
		thumbnail !== 'null' &&
		thumbnail !== 'None' &&
		thumbnail.trim() !== ''
			? thumbnail
			: CardPlaceholder

	const templateCodeName = templateName?.toLowerCase() || 'card'
	const badgeClass = badgeClassMap[templateCodeName] || s.badgeCard

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		onFavoriteToggle?.(id)
	}

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		onDelete?.(id)
	}

	return (
		<article className={s.card}>
			<div className={s.thumbnail}>
				<img
					src={normalizedThumbnail}
					alt={title}
					className={s.thumbnailImage}
				/>
				{templateName && (
					<span className={clsx(s.badge, badgeClass)}>{templateName}</span>
				)}
			</div>
			<div className={s.content}>
				{subjectName && <span className={s.subject}>{subjectName}</span>}
				<h3 className={s.title}>{title}</h3>
				{description && <p className={s.description}>{description}</p>}
				<div className={s.actions}>
					<Link
						to={path}
						className={s.link}
					>
						<Button className={s.button}>
							<Eye size={18} />
							Көру
						</Button>
					</Link>
					<button
						type="button"
						className={clsx(s.iconButton, isFavorite && s.iconButtonActive)}
						onClick={handleFavoriteClick}
						title={isFavorite ? 'Таңдаулыдан алу' : 'Таңдаулыға қосу'}
					>
						<Star
							size={18}
							fill={isFavorite ? 'currentColor' : 'none'}
						/>
					</button>
					{showDelete && (
						<button
							type="button"
							className={clsx(s.iconButton, s.iconButtonDelete)}
							onClick={handleDeleteClick}
							title="Жою"
						>
							<Trash2 size={18} />
						</button>
					)}
				</div>
			</div>
		</article>
	)
}
