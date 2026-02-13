import CardPlaceholder from '@/shared/assets/images/card-placeholder.png'
import { getFileUrl } from '@/shared/lib/fileUrl'
import { Button } from '@/shared/ui/button'
import clsx from 'clsx'
import { Eye, Lock, Pencil, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import s from './MaterialCard.module.scss'

interface MaterialCardProps {
	id: number
	title: string
	description?: string | null
	thumbnail?: string | null
	thumbnails?: (string | null)[]
	path: string
	subjectName?: string
	templateName?: string | null
	isFavorite?: boolean
	isLocked?: boolean
	showDelete?: boolean
	showEdit?: boolean
	onFavoriteToggle?: (id: number) => void
	onDelete?: (id: number) => void
	onEdit?: (id: number) => void
	onLockedClick?: () => void
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

const isValidImage = (v: string | null | undefined): v is string =>
	!!v && v !== 'null' && v !== 'None' && v.trim() !== ''

export const MaterialCard = ({
	id,
	title,
	description,
	thumbnail,
	thumbnails,
	path,
	subjectName,
	templateName,
	isFavorite = false,
	isLocked = false,
	showDelete = true,
	showEdit = false,
	onFavoriteToggle,
	onDelete,
	onEdit,
	onLockedClick
}: MaterialCardProps) => {
	const [currentImg, setCurrentImg] = useState(0)

	const images = (thumbnails ?? [thumbnail]).filter(isValidImage)
	const normalizedThumbnail = images.length > 0
		? getFileUrl(images[currentImg] || images[0])
		: CardPlaceholder
	const hasMultiple = images.length > 1

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

	const handleEditClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		onEdit?.(id)
	}

	const handleLockedClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		onLockedClick?.()
	}

	return (
		<article className={clsx(s.card, isLocked && s.cardLocked)}>
			<div className={s.thumbnail}>
				<img
					src={normalizedThumbnail}
					alt={title}
					className={s.thumbnailImage}
				/>
				{hasMultiple && (
					<>
						<button
							type="button"
							className={clsx(s.thumbNav, s.thumbNavLeft)}
							onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImg(i => (i - 1 + images.length) % images.length) }}
						>
							‹
						</button>
						<button
							type="button"
							className={clsx(s.thumbNav, s.thumbNavRight)}
							onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImg(i => (i + 1) % images.length) }}
						>
							›
						</button>
						<div className={s.thumbDots}>
							{images.map((_, i) => (
								<span key={i} className={clsx(s.thumbDot, i === currentImg && s.thumbDotActive)} />
							))}
						</div>
					</>
				)}
				{templateName && (
					<span className={clsx(s.badge, badgeClass)}>{templateName}</span>
				)}
				{isLocked && (
					<div className={s.lockOverlay} onClick={handleLockedClick}>
						<Lock size={24} />
					</div>
				)}
			</div>
			<div className={s.content}>
				{subjectName && <span className={s.subject}>{subjectName}</span>}
				<h3 className={s.title}>{title}</h3>
				{description && <p className={s.description}>{description}</p>}
				<div className={s.actions}>
					{isLocked ? (
						<Button className={s.button} onClick={handleLockedClick}>
							<Lock size={18} />
							Доступ қажет
						</Button>
					) : (
						<Link
							to={path}
							className={s.link}
						>
							<Button className={s.button}>
								<Eye size={18} />
								Көру
							</Button>
						</Link>
					)}
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
					{showEdit && (
						<button
							type="button"
							className={clsx(s.iconButton, s.iconButtonEdit)}
							onClick={handleEditClick}
							title="Өзгерту"
						>
							<Pencil size={18} />
						</button>
					)}
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
