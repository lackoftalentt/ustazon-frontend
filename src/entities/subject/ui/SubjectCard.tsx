import Arrow from '@/shared/assets/icons/arrowLeft.svg?react'
import CardPlaceholder from '@/shared/assets/images/card-placeholder.png'
import { Button } from '@/shared/ui/button'
import { Link } from 'react-router-dom'
import s from './SubjectCard.module.scss'

interface SubjectCardProps {
	id?: string | number
	title: string
	description?: string
	thumbnail?: string | null
	thumbnailAlt?: string
	path?: string
}

export const SubjectCard = ({
	title,
	description,
	thumbnail,
	thumbnailAlt = 'Subject thumbnail',
	path = '/subject'
}: SubjectCardProps) => {
	const normalizedThumbnail =
		thumbnail &&
		thumbnail !== 'null' &&
		thumbnail !== 'None' &&
		thumbnail.trim() !== ''
			? thumbnail
			: CardPlaceholder

	return (
		<article className={s.card}>
			<div className={s.thumbnail}>
				<img
					src={normalizedThumbnail}
					alt={thumbnailAlt}
					className={s.thumbnailImage}
				/>
			</div>
			<div className={s.container}>
				<h3 className={s.title}>{title}</h3>
				<p className={s.description}>{description}</p>
				<Link
					to={path}
					className={s.link}
				>
					<Button className={s.button}>
						Өту
						<Arrow className={s.arrowIcon} />
					</Button>
				</Link>
			</div>
		</article>
	)
}
